import { useBranches } from '../hooks/useBranches';
import { useNearestBranch } from '../hooks/useNearestBranch';
import { BranchCard } from '../components/BranchCard';
import type { Branch } from '../../../shared/types';
import './BranchSelectorScreen.css';

interface BranchSelectorScreenProps {
  onSelect: (branch: Branch) => void;
  onSkip?: () => void;
}

export const BranchSelectorScreen = ({ onSelect, onSkip }: BranchSelectorScreenProps) => {
  const { branches, isLoading: loadingBranches } = useBranches();
  const { nearestBranch, locationDenied, isLoading: loadingNearest, error } = useNearestBranch();

  const handleSelect = (branch: Branch) => {
    onSelect(branch);
  };

  if (loadingNearest || loadingBranches) {
    return (
      <div className="branch-selector">
        <div className="branch-selector__spinner">
          <p>Buscando tu sucursal más cercana...</p>
          <div className="branch-selector__loading-bar" />
        </div>
      </div>
    );
  }

  return (
    <div className="branch-selector">
      <h2 className="branch-selector__title">Elige tu sucursal</h2>
      <p className="branch-selector__subtitle">
        Selecciona la sucursal más conveniente para retirar tu pedido o de donde se despachará el domicilio.
      </p>

      {error && (
        <div className="branch-selector__error">Error: {error}</div>
      )}

      {nearestBranch && (
        <div className="branch-selector__nearest-section">
          <h3 className="branch-selector__section-title">Sucursal más cercana</h3>
          <div className="branch-selector__nearest">
            <BranchCard branch={nearestBranch} selected />
            <button
              className="branch-selector__confirm-btn"
              onClick={() => handleSelect(nearestBranch)}
            >
              Elegir esta sucursal
            </button>
          </div>
        </div>
      )}

      {locationDenied && (
        <div className="branch-selector__denied">
          No pudimos acceder a tu ubicación. Selecciona una sucursal de la lista.
        </div>
      )}

      <div className="branch-selector__all-section">
        <h3 className="branch-selector__section-title">Todas las sucursales</h3>
        <div className="branch-selector__grid">
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              selected={nearestBranch?.id === branch.id}
              onClick={handleSelect}
            />
          ))}
        </div>
      </div>

      {onSkip && (
        <button className="branch-selector__skip-btn" onClick={onSkip}>
          Omitir y continuar sin sucursal
        </button>
      )}
    </div>
  );
};