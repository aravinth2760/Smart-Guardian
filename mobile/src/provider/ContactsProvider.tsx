import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { contactService, ContactItem } from "@/services/contact.service";

type ContactsContextType = {
  loaded: boolean;
  contacts: ContactItem[];
  getName: (phone?: string | null, fallback?: string) => string;
  reloadContacts: () => Promise<void>;
};

const ContactsContext = createContext<ContactsContextType | null>(null);

export function ContactsProvider({ children }: { children: ReactNode }) {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
  const [loaded, setLoaded] = useState(false);
  const [contacts, setContacts] = useState<ContactItem[]>([]);

  const load = async () => {
    if (!currentUserId) return;
    const list = await contactService.loadContacts(currentUserId);

    setContacts(list);
    setLoaded(true);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <ContactsContext.Provider
      value={{
        loaded,
        contacts,
        getName: contactService.getName.bind(contactService),
        reloadContacts: load,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);

  if (!context) {
    throw new Error("useContacts must be used inside ContactsProvider");
  }

  return context;
}
