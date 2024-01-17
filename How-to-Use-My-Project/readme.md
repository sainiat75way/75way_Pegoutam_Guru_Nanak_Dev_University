How to use Pegoutam Saini 75 project

We have to create our account first means we have to register and the our data is stored in mongoDb and then we login and our token got generated and our now we have to create our wallet when we create wallet to steps process first it check is the user creating wallet has register if not then it will show error and using frontend we can send it to back to register page. If the user have already register than user wallet get created now user wan too do transaction. When user create wallet rupees 10 automatically get in to the wallet. Now user enter the if of both send and receiver and transaction got done and from sender account rupees 5 got deducted assume we have send 5 rupees and it got added into the receiver account both user receive the gmail I am using auth gmail sender here and if now user again try to send the money suppose balance now’s 5 and user try to send 10rs again user fill get error insufficient balance. And now we want to have the history of the user transaction we can easily get it by just entering user id and applying the filer.

How to Register in Pegoutam project

1. Got to - http://localhost:3000/register
2. You have to set it to post
3. In header choose content-type application/json
4. Give common din body like this
{
  "email": "example@email.com",
  "password": “password”,
  "name": “entername”,
}

You account have been created.

How to Login in Pegoutam project

1. Got to - http://localhost:3000/login
2. You have to set it to post
3. In header choose content-type application/json
4. Give common din body like this
{
  "email": "example@email.com",
  "password": “password”,
}

Let’s Create our wallet Now

How to Transfer Money ( For that we have to create wallet first ) 

Steps 

1. Go to - http://localhost:3000/wallet/create
2. Go to header choose Content-Type - application/json
3. Go to body > go to >
Set it POST then "Content-Type: application/json" 
4. Give this type command '{
  "email": “enter gmai lwhen you register,
  "password": “create new password”
}
4. Your wallet is created successfully.

How to Transfer money now

1. Go to - http://localhost:3000/wallet/transfer
2. curl -X POST -H "Content-Type: application/json" 
3. { “senderId": “entersenderid,
  "receiverId": “enter”recieverID,
  "amount": 5
}' 

Keep in mind I have given set 10 rs as in assignment 
And if you send all money then it will show insufficient balance

How to Get History Transaction Details

Go to given link I have used Thunder Client for this process 

DEMO GET http://localhost:3000/wallet/history/<userId>/<filter>

Working- http://localhost:3000/wallet/history/65a7965a3aafaa6606edb22f/week











