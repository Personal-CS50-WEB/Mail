document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').onsubmit = send_mail;

  // By default, load the inbox
  load_mailbox('inbox');
});



function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function send_mail() {

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    if ("error" in result) {
      alert(result['error']);
      console.log(result);
      compose_email();

  }
    else {
      console.log(result);
      load_mailbox('sent');
    }
    
  })
  .catch(error => {
    console.log('Error:', error);
    

});

  // Prevent default submission
  return false;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

   // Show the mailbox name
   document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
   fetch(`/emails/${mailbox}`)
   .then(response => response.json())
   .then(emails => {
       // Print emails
       console.log(emails);
       emails.forEach (email => {
        // create div for each email
          const element = document.createElement('div');
          element.classList.add('card');
          element.innerHTML = `
          <div class="order-2 d-flex">
         <div class="p-2">${email.subject}</div>
         <div class="ml-auto p-2">${email.timestamp}</div>
         </div>`;

        // when user view sent emails
        if(`${mailbox}`=== 'sent') {
          element.innerHTML += `
         <div class="order-1  p-2">${email.recipients}
         </div>
         `;
        }
        // when user view inbox and archived
        else {
          element.innerHTML += `
            <div class="order-1 p-2">${email.sender}
            </div>
            `;
          // if email  has been read
          if (email.read) {
            element.style.backgroundColor = "#cccccc";
           }
        }
         document.querySelector('#emails-view').append(element);      
       })

      })
   .catch(error => {
     console.log('Error:', error);
   });
}
