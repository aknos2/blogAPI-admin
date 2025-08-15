import './about.css';
import profilePhoto from '/assets/corgi/corgi-profile.webp';
import { GitHubIcon } from '../Icons';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="about-container">
      <h1>About this dog</h1>
      <div className='profile-content'>
        <div className='profile-img'>
          <img src={profilePhoto} alt="profile" />
        </div>
        <div className='description'>
          <div className='pt1'>
            <p>I'm a Corgi dog</p>
            <p>My motto is food, all good!</p>
          </div>
          <div></div>
          <div className='pt2'>
            <p>Check out my owner here:</p>
            <div className="github-icon">
              <GitHubIcon/>
            </div>
            <Link to="/credits">
              <p className='credits-link'>IMAGE CREDITS</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About;