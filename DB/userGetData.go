package main

import (
	"database/sql"
	"net/http"

	"github.com/benjaminRoberts01375/Gift-Guardian/DB/models"
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

// UserDataResponse combines user information and their lists
type UserDataResponse struct {
	User  models.PublicUser `json:"user"`
	Lists []models.List     `json:"lists"`
}

func userGetData(w http.ResponseWriter, r *http.Request) {
	_, userID, _, err := checkUserRequest[any](r)
	if err != nil {
		Coms.PrintErrStr("checkUserRequest failed: " + err.Error())
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	dbTransaction, err := database.Begin()
	if err != nil {
		Coms.PrintErrStr("failed to begin transaction: " + err.Error())
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	defer dbTransaction.Rollback()

	// Get public user data from email
	var publicUser models.PublicUser
	err = database.QueryRow("SELECT email, first_name, last_name FROM users WHERE id=$1", userID).Scan(&publicUser.Email, &publicUser.FirstName, &publicUser.LastName)
	if err != nil {
		Coms.PrintErrStr("could not get basic user data: " + err.Error())
		if err == sql.ErrNoRows {
			Coms.ExternalPostRespondCode(http.StatusNotFound, w) // User not found
			return
		}
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}

	lists, err := getLists(dbTransaction, userID)
	if err != nil {
		Coms.PrintErrStr("could not get lists: " + err.Error())
		Coms.ExternalPostRespondCode(http.StatusInternalServerError, w)
		return
	}
	dbTransaction.Commit()

	response := UserDataResponse{
		User:  publicUser,
		Lists: lists,
	}
	Coms.ExternalPostRespond(response, w)
}

func getLists(dbTransaction *sql.Tx, userID string) ([]models.List, error) {
	statement := `
		SELECT
			l.id, l.owner_id, l.name, l.private, l.created_at,
			g.id, g.list_id, g.name, g.created_at,
			gf.id, gf.group_id, gf.name, gf.description, gf.location, gf.created_at
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
			listPrivate     sql.NullBool
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
			giftLocation    sql.NullString
		)

		err = rows.Scan(
			&listID, &listOwnerID, &listName, &listPrivate, &listCreatedAt,
			&groupID, &groupListID, &groupName, &groupCreatedAt,
			&giftID, &giftGroupID, &giftName, &giftDescription, &giftLocation, &giftCreatedAt,
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
					Private:   listPrivate.Bool,
					CreatedAt: listCreatedAt.Time,
					Groups:    []models.Group{}, // Initialize slice
				}
			}
		}

		// Process Group
		if groupID.Valid {
			if _, exists := groupsMap[groupID.String]; !exists {
				group := &models.Group{ // Store pointer to Group
					ID:        groupID.String,
					ListID:    groupListID.String,
					Name:      groupName.String,
					CreatedAt: groupCreatedAt.Time,
					Gifts:     []models.Gift{}, // Initialize slice
				}
				groupsMap[groupID.String] = group
			}
		}

		// Process Gift
		if giftID.Valid {
			gift := models.Gift{
				ID:          giftID.String,
				GroupID:     giftGroupID.String,
				Name:        giftName.String,
				Description: giftDescription.String,
				CreatedAt:   giftCreatedAt.Time,
				Location:    giftLocation.String,
			}

			// Link gift to its group
			if group, ok := groupsMap[giftGroupID.String]; ok {
				group.Gifts = append(group.Gifts, gift)
			}
		}
	}

	// After all rows are processed, link groups to their lists
	for _, group := range groupsMap {
		if list, ok := listsMap[group.ListID]; ok {
			list.Groups = append(list.Groups, *group) // Append the dereferenced group
		}
	}

	// Convert map to slice
	var lists []models.List
	for _, list := range listsMap {
		lists = append(lists, *list)
	}
	return lists, nil
}
