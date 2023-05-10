# Email Client

This project is a simple email client with functionality to send and receive emails. It is a Django project contains a single app called mail.

### **Installation**
To install the necessary dependencies for this project, navigate to the root directory and run:

`pip install -r requirements.txt`
### **Usage**
To start the web server, make and apply migrations for the project, then run:
`python manage.py runserver`
Open the web server in your browser, and use the “Register” link to register for a new account. The emails you’ll be sending and receiving in this project will be entirely stored in your database (they won’t actually be sent to real email servers), so you’re welcome to choose any email address (e.g. foo@example.com) and password you’d like for this project: credentials need not be valid credentials for actual email addresses.

Once you’re signed in, you should see yourself taken to the Inbox page of the mail client, though this page is mostly blank (for now). Click the buttons to navigate to your Sent and Archived mailboxes, and notice how those, too, are currently blank. Click the “Compose” button, and you’ll be taken to a form that will let you compose a new email. Each time you click a button, though, you’re not being taken to a new route or making a new web request: instead, this entire application is just a single page, with JavaScript used to control the user interface.

### **API**
This application supports the following API routes:

- GET /emails/<str:mailbox>: Sending a GET request to /emails/<mailbox> where <mailbox> is either inbox, sent, or archive will return back to you (in JSON form) a list of all emails in that mailbox, in reverse chronological order.

- POST /emails: Sending a POST request to /emails with the body containing JSON data including recipients, subject, and body will create a new email and save it to the database.

- PUT /emails/<int:email_id>: Sending a PUT request to /emails/<email_id> with the body containing JSON data including archived or read will update the email in the database with the given email_id.

## **Credits**

This project is a part of the CS50W - Web Programming with Python and JavaScript course by Harvard University. The starter code was provided by the course staff, while the implementation of the missing features was done by the learner.
