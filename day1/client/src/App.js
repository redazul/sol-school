import logo from './logo.svg';
import './App.css';
import {struct, u32, ns64} from "@solana/buffer-layout";
import React, {useState,useEffect} from 'react';
import * as web3 from "@solana/web3.js";

const {Buffer} = require('buffer');














function App() {

  useEffect(() => {
    let keypair = web3.Keypair.generate();
    let payer = web3.Keypair.generate();
    let connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    console.log(connection)

    connection.requestAirdrop(
      payer.publicKey,
      web3.LAMPORTS_PER_SOL,
    ).then(airdropSignature=>{
      console.log(airdropSignature)
      connection.confirmTransaction(airdropSignature).then(resp=>{
        console.log(resp)
          let allocateTransaction = new web3.Transaction({
          feePayer: payer.publicKey
        });

        let keys = [{pubkey: keypair.publicKey, isSigner: true, isWritable: true}];
        let params = { space: 100 };

        let allocateStruct = {
          index: 8,
          layout: struct([
            u32('instruction'),
            ns64('space'),
          ])
        };

        let data = Buffer.alloc(allocateStruct.layout.span);
        let layoutFields = Object.assign({instruction: allocateStruct.index}, params);
        allocateStruct.layout.encode(layoutFields, data);

        allocateTransaction.add(new web3.TransactionInstruction({
          keys,
          programId: "DuLuH7VqgsEQooXcdmvrLWvhTxpMBKknVgDVSegCkdEH",
          data,
        }));

        web3.sendAndConfirmTransaction(connection, allocateTransaction, [payer, keypair]).then(resp=>{
          console.log(resp)
        })


      })
    })
  });




  




  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
