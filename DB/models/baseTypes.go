package models

import (
	"encoding/json"
	"time"
)

type List struct {
	ID        string    `json:"id"`
	OwnerID   string    `json:"owner_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	Groups    []Group   `json:"groups"`
}

func (list *List) String() string {
	jsonBytes, err := json.MarshalIndent(list, "", "  ")
	if err != nil {
		return list.Name
	}
	return string(jsonBytes)
}

type Group struct {
	ID        string    `json:"id"`
	ListID    string    `json:"list_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	Gifts     []Gift    `json:"gifts"`
}

func (group *Group) String() string {
	jsonBytes, err := json.MarshalIndent(group, "", "  ")
	if err != nil {
		return group.Name
	}
	return string(jsonBytes)
}

type Gift struct {
	ID          string    `json:"id"`
	GroupID     string    `json:"group_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	Gotten      bool      `json:"gotten"`
}

func (gift *Gift) String() string {
	jsonBytes, err := json.MarshalIndent(gift, "", "  ")
	if err != nil {
		return gift.Name
	}
	return string(jsonBytes)
}

type PublicUser struct {
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}
