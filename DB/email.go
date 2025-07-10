package main

import (
	Coms "github.com/benjaminRoberts01375/Go-Communicate"
	"github.com/resend/resend-go/v2"
)

func sendEmail(to string, subject string, message string) {
	if !config.AllowSendingEmails {
		Coms.Println("Not sending email to " + to)
		return
	}

	client := resend.NewClient(config.EmailAPIKey)
	emailParams := &resend.SendEmailRequest{
		From:    "No Reply <do-not-reply@mail.benlab.us>",
		To:      []string{to},
		Subject: subject,
		Text:    message,
	}
	_, err := client.Emails.Send(emailParams)
	if err != nil {
		Coms.PrintErrStr("Failed to send email: " + err.Error())
	}
}
