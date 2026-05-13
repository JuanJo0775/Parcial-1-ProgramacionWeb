import type { Branch } from '../../../shared/types';
import './BranchCard.css';

interface BranchCardProps {
  branch: Branch;
  selected?: boolean;
  onClick?: (branch: Branch) => void;
}

export const BranchCard = ({ branch, selected, onClick }: BranchCardProps) => (
  <div
    className={`branch-card ${selected ? 'branch-card--selected' : ''}`}
    onClick={() => onClick?.(branch)}
  >
    <h4 className="branch-card__name">{branch.name}</h4>
    <p className="branch-card__city">{branch.city} — {branch.department}</p>
    <p className="branch-card__address">{branch.address}</p>
    <p className="branch-card__phone">{branch.phone}</p>
    <p className="branch-card__hours">{branch.openHours}</p>
  </div>
);