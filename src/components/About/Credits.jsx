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