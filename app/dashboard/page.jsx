import React from 'react';
import '../css/dash.css'
import Nav from "./nav";

const DashboardPage = () => {

  return (
      <>
          <Nav />

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
              <a className="card" href="/recent">
                  <img
                      src="/img/logo_and_icon_brand_kit_nl/module_iconen/lesfiches_512x512.png"
                      alt="fiets"
                  />
                  <h1>Recent</h1>
              </a>
              <a className="card" href="">
                  <img src="" alt=""/>
                  <h1>Placeholder</h1>
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

export default DashboardPage;
