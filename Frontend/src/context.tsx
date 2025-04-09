import React, { useState, ReactNode } from "react";
import List from "./types/list.tsx";
import Group from "./types/group.tsx";
import Gift from "./types/gift.tsx";
import { ListContext, ListContextType } from "./context-template.tsx"; // Import from new file

// Create a provider component
interface ListProviderProps {
  children: ReactNode;
}

export const ListProvider: React.FC<ListProviderProps> = ({ children }) => {
  const [list, setList] = useState<List | null>(null);

  // Group operations
  const addGroup = (group: Group) => {
    if (!list) return;

    setList(new List(list.id, list.owner, list.title, [...list.groups, group]));
  };

  const updateGroup = (groupId: string, updatedGroup: Partial<Group>) => {
    if (!list) return;

    const updatedGroups = list.groups.map((group) => {
      if (group.id === groupId) {
        return new Group(
          group.id,
          updatedGroup.name || group.name,
          updatedGroup.gifts || group.gifts,
        );
      }
      return group;
    });

    setList(new List(list.id, list.owner, list.title, updatedGroups));
  };

  const removeGroup = (groupId: string) => {
    if (!list) return;

    const filteredGroups = list.groups.filter((group) => group.id !== groupId);
    setList(new List(list.id, list.owner, list.title, filteredGroups));
  };

  // Gift operations
  const addGift = (groupId: string, gift: Gift) => {
    if (!list) return;

    const updatedGroups = list.groups.map((group) => {
      if (group.id === groupId) {
        return new Group(group.id, group.name, [...group.gifts, gift]);
      }
      return group;
    });

    setList(new List(list.id, list.owner, list.title, updatedGroups));
  };

  const updateGift = (
    groupId: string,
    giftId: string,
    updatedGift: Partial<Gift>,
  ) => {
    if (!list) return;

    const updatedGroups = list.groups.map((group) => {
      if (group.id === groupId) {
        const updatedGifts = group.gifts.map((gift) => {
          if (gift.id === giftId) {
            return new Gift(
              gift.id,
              updatedGift.name || gift.name,
              updatedGift.url || gift.url,
            );
          }
          return gift;
        });

        return new Group(group.id, group.name, updatedGifts);
      }
      return group;
    });

    setList(new List(list.id, list.owner, list.title, updatedGroups));
  };

  const removeGift = (groupId: string, giftId: string) => {
    if (!list) return;

    const updatedGroups = list.groups.map((group) => {
      if (group.id === groupId) {
        const filteredGifts = group.gifts.filter((gift) => gift.id !== giftId);
        return new Group(group.id, group.name, filteredGifts);
      }
      return group;
    });

    setList(new List(list.id, list.owner, list.title, updatedGroups));
  };

  const moveGift = (fromGroupId: string, toGroupId: string, giftId: string) => {
    if (!list) return;

    // Find the gift to move
    const fromGroup = list.groups.find((group) => group.id === fromGroupId);
    if (!fromGroup) return;

    const giftToMove = fromGroup.gifts.find((gift) => gift.id === giftId);
    if (!giftToMove) return;

    // Create updated groups by removing the gift from source and adding to destination
    const updatedGroups = list.groups.map((group) => {
      if (group.id === fromGroupId) {
        const filteredGifts = group.gifts.filter((gift) => gift.id !== giftId);
        return new Group(group.id, group.name, filteredGifts);
      }

      if (group.id === toGroupId) {
        return new Group(group.id, group.name, [...group.gifts, giftToMove]);
      }

      return group;
    });

    setList(new List(list.id, list.owner, list.title, updatedGroups));
  };

  // List operations
  const updateListTitle = (title: string) => {
    if (!list) return;
    setList(new List(list.id, list.owner, title, list.groups));
  };

  const value: ListContextType = {
    list,
    setList,
    addGroup,
    updateGroup,
    removeGroup,
    addGift,
    updateGift,
    removeGift,
    moveGift,
    updateListTitle,
  };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};
