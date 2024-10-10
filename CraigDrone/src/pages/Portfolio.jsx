import PortfolioCardComponent from "../components/PortfolioCardComponent";
import PageHeader from "../components/PageHeader";
import "./Portfolio.css";

import { collection, DocumentSnapshot, getDocs, query, where } from "firebase/firestore";
import db from '../Firebase/Configuration.jsx';
import React, { useState, useEffect } from "react";

import portfolioEntries from "../portfolioEntries.json";

var sorted = {};

for (var i = 0, max = portfolioEntries.length; i < max; i++) {

  if (sorted[portfolioEntries[i].type] == undefined) {
    sorted[portfolioEntries[i].type] = [];
  }
  sorted[portfolioEntries[i].type].push(portfolioEntries[i]);
}

const Portfolio = () => {
  
  useEffect(() => {
    const urlHash = window.location.hash;
    if (urlHash.length) {
      const element = document.getElementById(urlHash);
      if (element) {
        setTimeout(function () {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 250);
      }
    }
    return () => {
    };
  }, [])

  function checkUndefinedSection(arrayString) {
    if (sorted[arrayString] != undefined) {
      return (sorted[arrayString].map(portfolioEntry =>
        <ul key={portfolioEntry.title} className="ulPortfolio">
          <PortfolioCardComponent description={portfolioEntry.description} video={portfolioEntry.videoURL} title={portfolioEntry.title} date={portfolioEntry.date} image={portfolioEntry.image} type={portfolioEntry.type} />
        </ul>)
      )
    }
  }


  return (
    <>

      <PageHeader image='../assets/NatureImage.jpg' hText="Portfolio" />

      <hr id='#Golf-Courses' className="hr-text" data-content="Golf Courses" />
      <div className="portfolioCardContainer">
        {checkUndefinedSection("Golf Courses\r")}
      </div>


      <hr id='#Real-Estate' className="hr-text" data-content="Real Estate" />
      <div className="portfolioCardContainer">
        {checkUndefinedSection("Real Estate\r")}
      </div>

      <hr id='#Construction' className="hr-text" data-content="Construction" />
      <div className="portfolioCardContainer">
        {checkUndefinedSection("Construction\r")}
      </div>

      <hr id='#Event-Coverage' className="hr-text" data-content="Event Coverage" />
      <div className="portfolioCardContainer">
        {checkUndefinedSection("Events\r")}
      </div>

      <hr id='#Other-Services' className="hr-text" data-content="Other Services" />
      <div className="portfolioCardContainer">
        {checkUndefinedSection("Other\r")}
      </div>

    </>
  )
};

export default Portfolio