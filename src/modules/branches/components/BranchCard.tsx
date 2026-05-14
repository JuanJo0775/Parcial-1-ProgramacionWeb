import type { Branch } from '../../../shared/types';
import './BranchCard.css';

interface BranchCardProps {
  branch: Branch;
  selected?: boolean;
  onClick?: (branch: Branch) => void;
}

export const BranchCard = ({ branch, selected, onClick }: BranchCardProps) => (
  <article className={`branch-card ${selected ? 'branch-card--selected' : ''}`}>
    <div className="branch-card__header">
      <h4 className="branch-card__name">{branch.name}</h4>
      {selected && <span className="branch-card__badge">Sugerida</span>}
    </div>
    <p className="branch-card__city">{branch.city} — {branch.department}</p>
    <p className="branch-card__address">{branch.address}</p>
    <p className="branch-card__phone">{branch.phone}</p>
    <p className="branch-card__hours">{branch.openHours}</p>
    {onClick && (
      <button
        className="branch-card__action"
        type="button"
        onClick={() => onClick(branch)}
      >
        Elegir sucursal
      </button>
    )}
  </article>
);