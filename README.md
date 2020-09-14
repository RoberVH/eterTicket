# eterTicket
Retail electronic tickets on Blockchain HLF

November 2018



Proof of concept  for Retail Store electronic tickets on the Blockchain.

* It allow Providers of goods to stores (manufacturers) to know what goods are sold and where at near real time, blockchain provides trustfulness of data recorded.

* It allow retails store customers to accumulate redeemable/tradeable points granted as a percentage of tikect price.

It was developed using Hyperledger Fabric IBM Bluemix free HLF cloud offering, two nodes were defined.
Node/Express Servers were developed and hosted at Azure free cloud service. There were two servers, one to collect and record tikects and other to serve queries to blockchain. This was done so there won't be need to install credentials at each client participant, as security was coded on guarded paths on Rest servers.

An Angular App was scaffolded with Yeoman and functionality to demo querying of demos. The app queries server and server implements security functions so only granted participant can se information, users only see they own tickets, stores only see their own store tickets and manufactures can see only their own products sale information. This app was hosted on a local VM for demo purposes.

A retailer sent electronic tickets coming from real time sales through Restful API provided by eterTicket server so demo could be carried on.

Azure/Servidor de request Blockchain eterQuest/eterQuest/

Server and chaincode to query server

The server provides security so there is not need to install credentials at user/retail/Manufacturer applications. The server send query transacctions to HLF. Is possible to obtain Tickets by store, date ranges, customer awarded points. 
Manufactures can get history of products sales by store/date ranges. This in real time and accurately, being this a major sale point of the whole system
Runs on Azure service.

Azure/Servidor recolector eterTicket

Server and chain code to record at the Ledger.
Retail stores write tickets files (JSON format, they must adhere to the format) to API Restful provided by server. This occurs at Point of Sale device and real time, so information is available for the server to process files as they become available.
Scalability issues could arise, so several servers would have  to be implemented. Tickets are read and recorded to HLF Blockchain. If customer number is provided, a percentages of ticket price is add to that customer account. Later on a wallet/app could be built so users can trade points with other users or change them for products at stores. Runs on Azure service

/eterCliente/eterClient1/
Angular App for demostrating user access to blockchain through server. Scaffolded with Yeoman and uses Composer Restful Server. Diffenter users and manufactures can consult information.
