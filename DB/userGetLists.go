package main

import (
	"database/sql"
	"net/http"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func userGetLists(w http.ResponseWriter, r *http.Request) {
	claims, isValid := userJWTIsValidFromCookie(r)
	if !isValid {
		Coms.ExternalPostRespondCode(http.StatusForbidden, w)
		return
	}
	dbTransaction, err := database.Begin()
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	defer dbTransaction.Rollback()

	// Get user ID from email
	var userID string
	err = database.QueryRow("SELECT id FROM users WHERE email=$1", claims.Username).Scan(&userID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	lists, err := getLists(dbTransaction, userID)
	if err != nil {
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	dbTransaction.Commit()
	Coms.ExternalPostRespond(lists, w)
}

func getLists(dbTransaction *sql.Tx, userID string) ([]models.List, error) {
	statement := `
		SELECT
			l.id, l.owner_id, l.name, l.created_at,
			g.id, g.list_id, g.name, g.created_at,
			gf.id, gf.group_id, gf.name, gf.description, gf.created_at, gf.gotten
		FROM
			lists l
		LEFT JOIN
			groups g ON l.id = g.list_id
		LEFT JOIN
			gifts gf ON g.id = gf.group_id
		WHERE
			l.owner_id = $1
		ORDER BY
			l.id, g.id, gf.id -- Important for consistent processing
	`
	rows, err := dbTransaction.Query(statement, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Use maps to build the nested structure efficiently
	listsMap := make(map[string]*models.List)
	groupsMap := make(map[string]*models.Group)

	for rows.Next() {
		var (
			listID          sql.NullString
			listOwnerID     sql.NullString
			listName        sql.NullString
			listCreatedAt   sql.NullTime
			groupID         sql.NullString
			groupListID     sql.NullString
			groupName       sql.NullString
			groupCreatedAt  sql.NullTime
			giftID          sql.NullString
			giftGroupID     sql.NullString
			giftName        sql.NullString
			giftDescription sql.NullString
			giftCreatedAt   sql.NullTime
			giftGotten      sql.NullBool
		)

		err = rows.Scan(
			&listID, &listOwnerID, &listName, &listCreatedAt,
			&groupID, &groupListID, &groupName, &groupCreatedAt,
			&giftID, &giftGroupID, &giftName, &giftDescription, &giftCreatedAt, &giftGotten,
		)
		if err != nil {
			return nil, err
		}

		// Process List
		if listID.Valid {
			if _, exists := listsMap[listID.String]; !exists {
				listsMap[listID.String] = &models.List{
					ID:        listID.String,
					OwnerID:   listOwnerID.String,
					Name:      listName.String,
					CreatedAt: listCreatedAt.Time,
					Groups:    []models.Group{}, // Initialize slice
				}
			}
		}

		// Process Group
		if groupID.Valid {
			if _, exists := groupsMap[groupID.String]; !exists {
				group := models.Group{
					ID:        groupID.String,
					ListID:    groupListID.String,
					Name:      groupName.String,
					CreatedAt: groupCreatedAt.Time,
					Gifts:     []models.Gift{}, // Initialize slice
				}
				groupsMap[groupID.String] = &group

				// Link group to its list
				if list, ok := listsMap[groupListID.String]; ok {
					list.Groups = append(list.Groups, group)
				}
			}
		}

		// Process Gift
		if giftID.Valid {
			if group, ok := groupsMap[giftGroupID.String]; ok {
				// Only append if it's a new gift for this group (avoid duplicates from joins)
				found := false
				for _, existingGift := range group.Gifts {
					if existingGift.ID == giftID.String {
						found = true
						break
					}
				}
				if !found {
					group.Gifts = append(group.Gifts, models.Gift{
						ID:          giftID.String,
						GroupID:     giftGroupID.String,
						Name:        giftName.String,
						Description: giftDescription.String,
						CreatedAt:   giftCreatedAt.Time,
						Gotten:      giftGotten.Bool,
					})
				}
			}
		}
	}

	// Convert map to slice
	var lists []models.List
	for _, list := range listsMap {
		lists = append(lists, *list)
	}
	return lists, nil
}
