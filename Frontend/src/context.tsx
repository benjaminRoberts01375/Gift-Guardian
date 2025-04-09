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
  const [lists, setLists] = useState<List[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);

  // List operations
  const addList = (list: List) => {
    setLists([...lists, list]);
  };

  const updateList = (listId: string, updatedList: Partial<List>) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return new List(
          list.id,
          updatedList.owner || list.owner,
          updatedList.title || list.title,
          updatedList.groups || list.groups,
        );
      }
      return list;
    });

    setLists(updatedLists);
  };

  const removeList = (listId: string) => {
    const filteredLists = lists.filter((list) => list.id !== listId);
    setLists(filteredLists);

    // If we're removing the active list, reset activeListId
    if (activeListId === listId) {
      setActiveListId(filteredLists.length > 0 ? filteredLists[0].id : null);
    }
  };

  const updateListTitle = (listId: string, title: string) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return new List(list.id, list.owner, title, list.groups);
      }
      return list;
    });

    setLists(updatedLists);
  };

  // Helper function to find and update a specific list
  const updateListById = (listId: string, updateFn: (list: List) => List) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return updateFn(list);
      }
      return list;
    });

    setLists(updatedLists);
  };

  // Group operations
  const addGroup = (listId: string, group: Group) => {
    updateListById(listId, (list) => {
      return new List(list.id, list.owner, list.title, [...list.groups, group]);
    });
  };

  const updateGroup = (
    listId: string,
    groupId: string,
    updatedGroup: Partial<Group>,
  ) => {
    updateListById(listId, (list) => {
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

      return new List(list.id, list.owner, list.title, updatedGroups);
    });
  };

  const removeGroup = (listId: string, groupId: string) => {
    updateListById(listId, (list) => {
      const filteredGroups = list.groups.filter(
        (group) => group.id !== groupId,
      );
      return new List(list.id, list.owner, list.title, filteredGroups);
    });
  };

  // Gift operations
  const addGift = (listId: string, groupId: string, gift: Gift) => {
    updateListById(listId, (list) => {
      const updatedGroups = list.groups.map((group) => {
        if (group.id === groupId) {
          return new Group(group.id, group.name, [...group.gifts, gift]);
        }
        return group;
      });

      return new List(list.id, list.owner, list.title, updatedGroups);
    });
  };

  const updateGift = (
    listId: string,
    groupId: string,
    giftId: string,
    updatedGift: Partial<Gift>,
  ) => {
    updateListById(listId, (list) => {
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

      return new List(list.id, list.owner, list.title, updatedGroups);
    });
  };

  const removeGift = (listId: string, groupId: string, giftId: string) => {
    updateListById(listId, (list) => {
      const updatedGroups = list.groups.map((group) => {
        if (group.id === groupId) {
          const filteredGifts = group.gifts.filter(
            (gift) => gift.id !== giftId,
          );
          return new Group(group.id, group.name, filteredGifts);
        }
        return group;
      });

      return new List(list.id, list.owner, list.title, updatedGroups);
    });
  };

  const moveGift = (
    listId: string,
    fromGroupId: string,
    toGroupId: string,
    giftId: string,
  ) => {
    updateListById(listId, (list) => {
      // Find the gift to move
      const fromGroup = list.groups.find((group) => group.id === fromGroupId);
      if (!fromGroup) return list;

      const giftToMove = fromGroup.gifts.find((gift) => gift.id === giftId);
      if (!giftToMove) return list;

      // Create updated groups by removing the gift from source and adding to destination
      const updatedGroups = list.groups.map((group) => {
        if (group.id === fromGroupId) {
          const filteredGifts = group.gifts.filter(
            (gift) => gift.id !== giftId,
          );
          return new Group(group.id, group.name, filteredGifts);
        }

        if (group.id === toGroupId) {
          return new Group(group.id, group.name, [...group.gifts, giftToMove]);
        }

        return group;
      });

      return new List(list.id, list.owner, list.title, updatedGroups);
    });
  };

  const value: ListContextType = {
    lists,
    setLists,
    activeListId,
    setActiveListId,
    addList,
    updateList,
    removeList,
    updateListTitle,
    addGroup,
    updateGroup,
    removeGroup,
    addGift,
    updateGift,
    removeGift,
    moveGift,
  };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};
