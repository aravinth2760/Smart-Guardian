import * as Contacts from "expo-contacts/legacy";

import { checkContacts } from "@/api/user.api";

export type ContactItem = {
  id: string;
  name: string;
  phone: string;
  isRegistered: boolean;
  userId?: string;
};

type RegisteredUser = {
  id: string;
  phone: string;
};

const formatPhone = (phone?: string | null) => {
  if (!phone) return "";

  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("91") && digits.length > 10) {
    digits = digits.slice(-10);
  }

  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  return phone;
};

class ContactService {
  private contacts: ContactItem[] = [];
  private contactMap = new Map<string, string>();

  async loadContacts(currentUserId: string) {
    // Return cached contacts
    if (this.contacts.length > 0) {
      return this.contacts;
    }

    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== "granted") {
      return [];
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    });

    const formattedContacts = data
      .filter((contact) => contact.phoneNumbers?.length)
      .map((contact) => ({
        id: contact.id,
        name: contact.name || "Unknown",
        phone: formatPhone(contact.phoneNumbers?.[0]?.number),
      }));

    try {
      const registeredUsers = await checkContacts({
        phones: formattedContacts.map((contact) => contact.phone),
      });

      const userMap = new Map<string, RegisteredUser>();

      registeredUsers.forEach((user) => {
        userMap.set(formatPhone(user.phone), user);
      });

      this.contacts = formattedContacts
        .map((contact) => {
          const user = userMap.get(contact.phone);

          return {
            ...contact,
            isRegistered: !!user,
            userId: user?.id,
          };
        })
        .filter((contact) => contact.userId !== currentUserId)
        .sort((a, b) => {
          // Registered contacts first
          if (a.isRegistered !== b.isRegistered) {
            return a.isRegistered ? -1 : 1;
          }

          // Then sort by name
          return a.name.localeCompare(b.name);
        });
    } catch (error) {
      console.log("Check contacts error:", error);

      this.contacts = formattedContacts
        .map((contact) => ({
          ...contact,
          isRegistered: false,
          userId: undefined,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    this.contactMap.clear();

    this.contacts.forEach((contact) => {
      this.contactMap.set(contact.phone, contact.name);
    });

    return this.contacts;
  }

  getContacts() {
    return this.contacts;
  }

  getName(phone?: string | null, fallback = "Unknown") {
    return this.contactMap.get(formatPhone(phone)) ?? fallback;
  }

  clear() {
    this.contacts = [];
    this.contactMap.clear();
  }
}

export const contactService = new ContactService();
