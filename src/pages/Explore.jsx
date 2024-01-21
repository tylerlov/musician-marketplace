import React from 'react'
import {Link} from 'react-router-dom'
import equipmentCategoryImage from '../assets/jpg/equipment-banner.jpg'
import instrumentCategoryImage from '../assets/jpg/instrument-banner.jpg'
import Slider from '../components/Slider'

function Explore() {
  return (
<div className="explore">
  <header>
    <p className="pageHeader">Explore</p>
  </header>

  <main>

    <Slider />
    <p className="exploreCategoryHeading">Categories</p>
    <div className="exploreCategories">
      <Link to='/category/equipment'>
        <img src={equipmentCategoryImage} alt="equipment" className="exploreCategoryImg"/>
        <p className="exploreCategoryName">Equipment</p>
      </Link>
      <Link to='/category/instrument'>
        <img src={instrumentCategoryImage} alt="instrument" className="exploreCategoryImg"/>
        <p className="exploreCategoryName">Instruments</p>

      </Link>
    </div>
  </main>
</div>
)
}

export default Explore