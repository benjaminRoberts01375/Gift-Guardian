package models

import (
	"time"
)

type List struct {
	ID        string    `json:"id"`
	OwnerID   string    `json:"owner_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	Groups    []Group   `json:"groups"`
}

type Group struct {
	ID        string    `json:"id"`
	ListID    string    `json:"list_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	Gifts     []Gift    `json:"gifts"`
}

type Gift struct {
	ID          string    `json:"id"`
	GroupID     string    `json:"group_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	Gotten      bool      `json:"gotten"`
}
