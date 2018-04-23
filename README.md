#IBX Paint: Ordering System

## What is this?

This is an Test ordering system for the IBX Paint Company. This was a group project for my Software Engineering class.

## How does it work?

This project consists of NodeJS and Golang in the back-end. JQuery, Toastr and Boostrap on the front-end. Golang is used as a load balancer (reverse proxy) and it programattically takes the input from all servers and outputs it in the load balancer's output using dynamic programming. The proxy settings can be changed by editing the ``` settings.json ``` file. 

## How do I run it?

Run the project by install Golang and typing ``` go run load_balancer.go ``` in the terminal or command prompt.

## Live website?

http://ibxpaint.bubbajoe.us

## Woulda Coulda Shoulda...

Its too back-end dependent, I should have made it so that the whole form process is a single page or double page that loads in data as needed. 