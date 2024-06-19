'use client'
import React, {useEffect} from 'react';
import './dash.css'
import jwt from 'jsonwebtoken';
import {jwtConfig} from "../../lib/jwt";

const Page = () => {

    useEffect(() => {
        const token = sessionStorage.getItem('userId');

        if (!token) {
            window.location.href="/"
        } else {
            try {
                const secretKey = jwtConfig.secret_Key;
                jwt.verify(token, secretKey); // Replace 'your-secret-key' with your actual secret key
            } catch (error) {
                console.error('Invalid token', error);
                window.location.href="/dashboard"
            }
        }
    }, []);

  return (
      <>

          <div className={"dashBody"}>
          <div className="card-container">
              <a href="https://donboscosdw.smartschool.be/login" className="card">
                  <img src="/img/smartschool.png" alt=""/>
                  <h1>Smartschool</h1>
              </a>
              <a href="/attitudekaarten" className="card">
                  <img
                      src="/img/logo_and_icon_brand_kit_nl/module_iconen/leerlingvolgsysteem_512x512.png"
                      alt="att"
                  />
                  <h1>Attitudekaarten</h1>
              </a>
              <a className="card" href="/recente">
                  <img
                      src="/img/logo_and_icon_brand_kit_nl/module_iconen/lesfiches_512x512.png"
                      alt="fiets"
                  />
                  <h1>Recent</h1>
              </a>
              <a className="card" href="/codes">
                  <img src="/img/logo_and_icon_brand_kit_nl/module_iconen/planner_512x512.png" alt=""/>
                  <h1>Alle codes</h1>
              </a>
              <div className="card">
                  <img src="" alt=""/>
                  <h1>Placeholder</h1>
              </div>
              <div className="card">
                  <img src="" alt=""/>
                  <h1>Placeholder</h1>
              </div>
          </div>
      </div>
          </>
  );

};

export default Page;
