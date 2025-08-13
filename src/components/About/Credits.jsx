import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "../Icons";

function Credits() {
  return (
    <div className="credits-container">
      <h1>Credits</h1>
      <div className="credits-pixabay">
        <h3><a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3389729">Pixabay</a></h3>
        <ul>
          <li>
            Corgi standing by <a href="https://pixabay.com/users/huoadg5888-8934889/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3389729">huoadg5888</a> 
          </li>
          <li>
            Corgi header by <a href="https://pixabay.com/users/petfoto-34205568/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8112818">Foden Nguyen</a>
          </li>
          <li>
            Corgi running by <a href="https://pixabay.com/users/molnarszabolcserdely-2742379/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8008483">Szabolcs Molnar</a>
          </li>
          <li>
            Corgi feeling the breeze by <a href="https://pixabay.com/users/molnarszabolcserdely-2742379/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6394502">Szabolcs Molnar</a> 
          </li>
          <li>
            Corgi and plant by <a href="https://pixabay.com/users/molnarszabolcserdely-2742379/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6394499">Szabolcs Molnar</a>
          </li>
          <li>
            Corgi walking on train trail by <a href="https://pixabay.com/users/huoadg5888-8934889/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4415649">huoadg5888</a> 
          </li>
          <li>
            Corgi in the train by <a href="https://pixabay.com/users/huoadg5888-8934889/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4383143">huoadg5888</a> 
          </li>
          <li>
            Avatar image by <a href="https://pixabay.com/users/u_7egpmxvswe-41433646/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8499572">u_7egpmxvswe</a>
          </li>
          <li>
            Avatar image by <a href="https://pixabay.com/users/u_fg0tkeqgiy-26019190/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8661433">Tim</a>
          </li>
          <li>
            Avatar image by <a href="https://pixabay.com/users/dovena-9018873/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4494980">dovena</a>
          </li>
          <li>
            Avatar image by<a href="https://pixabay.com/users/mofarrelly-1621639/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8877496">Mo Farrelly</a>
          </li>
          <li>
            Avatar image by  <a href="https://pixabay.com/users/amrets-38512306/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8184093">Sadiur Rahman Sadib</a> 
          </li>
          <li>
            Avatar image by <a href="https://pixabay.com/users/heroo15-28671259/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7901451">Heroo15</a> 
          </li>
          <li>
            Avatar image by <a href="https://pixabay.com/users/gwennhyfar-6697213/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2951896">Jennifer R.</a>
         </li>
          <li>
            Avatar image by <a href="https://pixabay.com/users/biancavandijk-9606149/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8280156">Bianca Van Dijk</a>
          </li>
        </ul>
        <Link to="/about">
        <div className="credits-back-btn-wrap">
          <ArrowLeftIcon />
          <p className="credits-back-btn">Back</p>
        </div>
        </Link>
      </div>
    </div>
  )
}

export default Credits;