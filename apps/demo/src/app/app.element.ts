import { AFrameElement, customElement } from '@metapins/aframe-element';
import { observe } from '@metapins/lit-observe';
import 'aframe';
import 'aframe-blink-controls';
import 'aframe-environment-component';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement as customLitElement } from 'lit/decorators.js';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';

@customLitElement('aframe-element-root')
export class AppElement extends LitElement {
  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  private reset() {
    jeux$.next([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    gagnant$.next('');
  }

  protected render(): unknown {
    return html`
      <a-scene cursor="rayOrigin: mouse; fuse: false;">
        <a-entity
          environment="preset:forest; shadow: false: skyType: atmosphere;"
        ></a-entity>

        <a-entity id="player">
          <a-entity
            id="camera"
            position="0 2 5"
            camera
            wasd-controls
            look-controls
          ></a-entity>

          <a-entity
            laser-controls="hand: left"
            blink-controls="cameraRing: #player; teleportOrigin: "camera"; collisionEntities: .environmentGround;"
            raycaster="objects: .clickable"
          ></a-entity>
          <a-entity
          laser-controls="hand: right"
          blink-controls="cameraRing: #player; teleportOrigin: "camera"; collisionEntities: .environmentGround;"
          raycaster="objects: .clickable"
        ></a-entity>
        </a-entity>

        <a-entity pion="ligne: 0; colonne: 0;" position="0 0.5 0"></a-entity>
        <a-entity pion="ligne: 0; colonne: 1;" position="1.1 0.5 0"></a-entity>
        <a-entity pion="ligne: 0; colonne: 2;" position="2.2 0.5 0"></a-entity>
        <a-entity pion="ligne: 1; colonne: 0;" position="0 1.6 0"></a-entity>
        <a-entity pion="ligne: 1; colonne: 1;" position="1.1 1.6 0"></a-entity>
        <a-entity pion="ligne: 1; colonne: 2;" position="2.2 1.6 0"></a-entity>
        <a-entity pion="ligne: 2; colonne: 0;" position="0 2.7 0"></a-entity>
        <a-entity pion="ligne: 2; colonne: 1;" position="1.1 2.7 0"></a-entity>
        <a-entity pion="ligne: 2; colonne: 2;" position="2.2 2.7 0"></a-entity>
        <a-sphere
          position="-2 0 0"
          scale="0.4 1 0.4"
          @click=${() => this.reset()}
          class="clickable"
        ></a-sphere>

        ${observe(gagnant$, (gagnant) =>
          gagnant === 'O'
            ? html`
                <a-box scale="4 6 3" position="1.1 0.5 0"></a-box>
                <a-text
                  value="O a gagner"
                  scale="3 6 3"
                  position="-0.4 1.8 1.64"
                ></a-text>
              `
            : html``
        )}
        ${observe(gagnant$, (gagnant) =>
          gagnant === 'X'
            ? html`
                <a-box scale="4 6 3" position="1.1 0.5 0"></a-box>
                <a-text
                  value="X a gagner"
                  scale="3 6 3"
                  position="-0.4 1.8 1.64"
                ></a-text>
              `
            : html``
        )}
      </a-scene>
    `;
  }
}

const jeux$ = new BehaviorSubject([
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
]);
let joueur = 'X';
const gagnant$ = new BehaviorSubject('');

async function jouer(ligne, colonne) {
  const jeux = JSON.parse(JSON.stringify(await firstValueFrom(jeux$)));

  if (jeux[ligne][colonne] === '') {
    jeux[ligne][colonne] = joueur;

    if (joueur === 'X') joueur = 'O';
    else joueur = 'X';
  }

  const gagnant = verifieGagnant(jeux);
  gagnant$.next(gagnant);

  if (gagnant === 'O') console.log('le gagnant est O');

  if (gagnant === 'X') console.log(' le gagnant est X');

  jeux$.next(jeux);
}

function verifieGagnant(jeux) {
  if (jeux[2][0] == 'O' && jeux[1][1] == 'O' && jeux[0][2] == 'O') return 'O';

  if (jeux[2][0] == 'X' && jeux[1][1] == 'X' && jeux[0][2] == 'X') return 'X';

  if (jeux[2][2] == 'O' && jeux[1][1] == 'O' && jeux[0][0] == 'O') return 'O';

  if (jeux[2][2] == 'X' && jeux[1][1] == 'X' && jeux[0][0] == 'X') return 'X';

  if (jeux[2][0] == 'O' && jeux[2][1] == 'O' && jeux[2][2] == 'O') return 'O';

  if (jeux[2][0] == 'X' && jeux[2][1] == 'X' && jeux[2][2] == 'X') return 'X';

  if (jeux[1][0] == 'O' && jeux[1][1] == 'O' && jeux[1][2] == '0') return 'O';

  if (jeux[1][0] == 'X' && jeux[1][1] == 'X' && jeux[1][2] == 'X') return 'X';

  if (jeux[0][0] == 'O' && jeux[0][1] == 'O' && jeux[0][2] == 'O') return 'O';

  if (jeux[0][0] == 'X' && jeux[0][1] == 'X' && jeux[0][2] == 'x') return 'X';

  if (jeux[2][0] == 'O' && jeux[1][0] == 'O' && jeux[0][0] == 'O') return 'O';

  if (jeux[2][0] == 'X' && jeux[1][0] == 'X' && jeux[0][0] == 'X') return 'X';

  if (jeux[2][1] == 'O' && jeux[1][1] == 'O' && jeux[0][1] == 'O') return 'O';

  if (jeux[2][1] == 'X' && jeux[1][1] == 'X' && jeux[0][1] == 'X') return 'X';

  if (jeux[2][2] == 'O' && jeux[1][2] == 'O' && jeux[0][2] == 'O') return 'O';

  if (jeux[2][2] == 'X' && jeux[1][2] == 'X' && jeux[0][2] == 'X') return 'X';

  if (jeux[1][0] == 'O' && jeux[1][1] == 'O' && jeux[1][2] == 'O') return 'O';

  if (jeux[1][0] == 'X' && jeux[1][1] == 'X' && jeux[1][2] == 'X') return 'X';
}

@customElement('pion')
export class PionElement extends AFrameElement {
  static schema = {
    ligne: { type: 'int' },
    colonne: { type: 'int' },
  };

  player$ = jeux$.pipe(map((jeux) => jeux[this.data.ligne][this.data.colonne]));

  async onClick() {
    jouer(this.data.ligne, this.data.colonne);
  }

  render(): TemplateResult {
    return html`
      <a-box class="clickable" @click=${() => this.onClick()} scale="1 1 0.1"></a-box>
      <a-text
        value=${observe(this.player$)}
        scale="6 6 1"
        position="-0.52 0 0.05"
      ></a-text>
    `;
  }
}
