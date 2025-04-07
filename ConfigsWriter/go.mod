module github.com/benjaminRoberts01375/Gift-Guardian/ConfigsWriter

go 1.24.2

require (
    github.com/benjaminRoberts01375/Go-Communicate v0.0.0-20250406175748-379c2a8bdbf4
    github.com/benjaminRoberts01375/Gift-Guardian/DB v0.0.0
)

replace (
    github.com/benjaminRoberts01375/Gift-Guardian/DB => ../DB
)