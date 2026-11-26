/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import HorizonteApp from './horizonte/App';
import { ErrorBoundary } from './horizonte/components/ErrorBoundary';
import { MobileLandscapeFrame } from './horizonte/components/MobileLandscapeFrame';

export default function App() {
  return (
    <ErrorBoundary
      fallbackTitle="Horizonte Estelar — Recuperação de Sessão"
      onReset={() => window.location.reload()}
    >
      <MobileLandscapeFrame>
        <HorizonteApp />
      </MobileLandscapeFrame>
    </ErrorBoundary>
  );
}
