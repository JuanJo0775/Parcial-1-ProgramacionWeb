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
  const { branches, isLoading: loadingBranches, error: branchesError, fetchBranches } = useBranches();
  const { nearestBranch, locationDenied, isLoading: loadingNearest, error: nearestError } = useNearestBranch();

  const handleSelect = (branch: Branch) => {
    onSelect(branch);
  };

  const error = branchesError || nearestError;

  if (loadingNearest || loadingBranches) {
    return (
      <section className="branch-selector" aria-labelledby="branch-title">
        <div className="branch-selector__spinner" role="status" aria-live="polite">
          <p>Buscando tu sucursal mas cercana...</p>
          <div className="branch-selector__loading-bar" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="branch-selector" aria-labelledby="branch-title">
        <div className="branch-selector__error-state">
          <h3 className="branch-selector__error-title">No hay sucursales disponibles</h3>
          <p className="branch-selector__error-text">Hubo un problema al cargar las sucursales. Por favor intenta de nuevo.</p>
          <button className="branch-selector__error-btn" type="button" onClick={() => fetchBranches()}>
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="branch-selector" aria-labelledby="branch-title">
      <header className="branch-selector__header">
        <div>
          <h2 id="branch-title" className="branch-selector__title">Elige tu sucursal</h2>
          <p className="branch-selector__subtitle">
            Selecciona la sucursal mas conveniente para retirar tu pedido o desde donde se despachara el domicilio.
          </p>
        </div>
        <p className="branch-selector__count">{branches.length} sucursales disponibles</p>
      </header>

      {error && (
        <div className="branch-selector__error" role="alert">
          No pudimos cargar las sucursales. Intenta de nuevo. {error}
        </div>
      )}

      {nearestBranch && (
        <div className="branch-selector__nearest-section">
          <h3 className="branch-selector__section-title">Sucursal sugerida</h3>
          <div className="branch-selector__nearest">
            <BranchCard branch={nearestBranch} selected />
            <button
              className="branch-selector__confirm-btn"
              type="button"
              onClick={() => handleSelect(nearestBranch)}
            >
              Usar esta sucursal
            </button>
          </div>
        </div>
      )}

      {locationDenied && (
        <div className="branch-selector__denied" role="status">
          No pudimos acceder a tu ubicacion. Selecciona una sucursal de la lista.
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
        <button className="branch-selector__skip-btn" type="button" onClick={onSkip}>
          Omitir y continuar sin sucursal
        </button>
      )}
    </section>
  );
};