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
    // check if error 
    if ("error" in result) {
      alert(result['error']);
      console.log(result);
      compose_email();

  }
    else {
      //if email sent return to sent mail box
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
        element.addEventListener('click', () => view_mail(email.id, mailbox));
        document.querySelector('#emails-view').append(element);  
        
       })

      })
   .catch(error => {
     console.log('Error:', error);
   });
}

function view_mail(id, mailbox) {

   // Show the emial view  and hide other views
   document.querySelector('#emails-view').style.display = 'none';
   document.querySelector('#compose-view').style.display = 'none';
   document.querySelector('#email-view').style.display = 'block';
   document.querySelector('#email-view').innerHTML='';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
  // Print email
    console.log(email);
    const mail = document.querySelector('#email-view');
    var e = `${JSON.stringify(email)}`;
    e = e.replace(/[']/g, "")
    mail.innerHTML =`
    <div class="container">
      <div><p class="font-weight-bold"> From: <span class="font-weight-normal">${email.sender}</span></p></div>
      <div><p class="font-weight-bold">To: <span class="font-weight-normal">${email.recipients}</span></p></div>
      <div><p class="font-weight-bold">Subject: <span class="font-weight-normal">${email.subject}</span></p></div>
      <div><p class="font-weight-bold">Time: <span class="font-weight-normal">${email.timestamp}</span></p></div>
      <div><button id="replay" onclick='replay(${e})' class="btn btn-sm btn-outline-primary">replay</button></div>
      <hr>
      <div style='white-space:pre' class="p-2">${email.body}</div>
    </div>`;

    // when check inbox user can archive emails
    if (`${mailbox}`=== 'inbox') {
      mail.innerHTML += `
      <div class="container">
      <button id ="True" onclick=archive(${email.id},this.id); class="btn btn-sm btn-outline-primary">Archive </button>
      </div>
      `;
    }
    //when check archive user can unarchive emails
    else if (`${mailbox}`=== 'archive') {
      mail.innerHTML += `
      <div class="container">
      <div><button id="False" onclick=archive(${email.id},this.id); class="btn btn-sm btn-outline-primary">unarchive </button></div>
      </div>
      `;
  }
  
})
.catch(error => {
  console.log('Error:', error);
});
// change email to read
fetch(`/emails/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
})

}

function archive(email, button_id){
  //archive or unarchive email
  fetch(`/emails/${email}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: button_id
    })
  })
  .then(()=> load_mailbox('inbox'))
}

function replay(mail){
  // display defult values for the replay from original email
  compose_email();
  document.querySelector('#compose-recipients').value = `${mail.sender}`;
  document.querySelector('#compose-body').value = 
  '\r\n' + `\n \n On ${mail.timestamp} ${mail.sender} wrote:\n ${mail.body}
   `;
  let subject = `${mail.subject}`
   if (subject.search("RE:")=== 0) {
    document.querySelector('#compose-subject').value = `${mail.subject}`;
    
   }
   else {
    document.querySelector('#compose-subject').value = `RE: ${mail.subject}`;
    
   }

}