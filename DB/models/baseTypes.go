package models

import "time"

type List struct {
	ID        int       `json:"id"`
	OwnerID   int       `json:"owner_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

type Group struct {
	ID        int       `json:"id"`
	ListID    int       `json:"list_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

type Gift struct {
	ID          int       `json:"id"`
	GroupID     int       `json:"group_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	Gotten      bool      `json:"gotten"`
}
