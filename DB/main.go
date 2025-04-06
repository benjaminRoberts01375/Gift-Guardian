package main

import (
	"net/http"

	Coms "github.com/benjaminRoberts01375/Go-Communicate"
)

func main() {
	Coms.ReadConfig()
	Coms.Println("Going up")
	http.ListenAndServe(Coms.GetLaunchPort(), nil)
}
