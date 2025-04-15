package models

import (
	"database/sql"
	"time"
)

type Upsertable interface {
	Upsert(dbTransaction *sql.Tx) error
}

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

func (list *List) Upsert(dbTransaction *sql.Tx) error {
	// If there's no ID, it's a new list
	var err error
	if list.ID == "" { // Add new list
		err = dbTransaction.QueryRow(`
			INSERT INTO lists (owner_id, name) 
			VALUES ($1, $2) 
			RETURNING id
		`, list.OwnerID, list.Name).Scan(&list.ID)
	} else { // Update existing list
		_, err = dbTransaction.Exec("UPDATE lists SET name = $1 WHERE id = $2 AND owner_id = $3",
			list.Name, list.ID, list.OwnerID)
	}
	if err != nil {
		return err
	}

	for i := range list.Groups {
		list.Groups[i].ListID = list.ID
		err = list.Groups[i].Upsert(dbTransaction)
		if err != nil {
			return err
		}
	}

	return nil
}

func (group *Group) Upsert(dbTransaction *sql.Tx) error {
	var err error
	if group.ID == "" { // Add new group
		err = dbTransaction.QueryRow(`
			INSERT INTO groups (list_id, name) 
			VALUES ($1, $2) 
			RETURNING id
			`, group.ListID, group.Name).Scan(&group.ID)
	} else { // Update existing group
		err = dbTransaction.QueryRow(`
			UPDATE groups SET name = $1 WHERE id = $2 AND list_id = $3
			`, group.Name, group.ID, group.ListID).Scan(&group.ID)
	}
	if err != nil {
		return err
	}

	for i := range group.Gifts {
		group.Gifts[i].GroupID = group.ID
		err = group.Gifts[i].Upsert(dbTransaction)
		if err != nil {
			return err
		}
	}

	return nil
}

func (gift *Gift) Upsert(dbTransaction *sql.Tx) error {
	var err error
	if gift.ID == "" { // Add new gift
		err = dbTransaction.QueryRow(`
			INSERT INTO gifts (group_id, name, description, gotten) 
			VALUES ($1, $2, $3, $4) 
			RETURNING id
		`, gift.GroupID, gift.Name, gift.Description, gift.Gotten).Scan(&gift.ID)
	} else { // Update existing gift
		err = dbTransaction.QueryRow(`
			UPDATE gifts SET name = $1, description = $2, gotten = $3 WHERE id = $4 AND group_id = $5
		`, gift.Name, gift.Description, gift.Gotten, gift.ID, gift.GroupID).Scan(&gift.ID)
	}
	return err
}
