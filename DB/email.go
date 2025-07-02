package main

import "github.com/resend/resend-go/v2"

func sendEmail(to string, subject string, message string) {
	if !config.AllowSendingEmails {
		return
	}

	client := resend.NewClient(config.EmailAPIKey)
	emailParams := &resend.SendEmailRequest{
		From:    "No Reply <do-not-reply@mail.benlab.us>",
		To:      []string{to},
		Subject: subject,
		Text:    message,
	}
	client.Emails.Send(emailParams)
}
