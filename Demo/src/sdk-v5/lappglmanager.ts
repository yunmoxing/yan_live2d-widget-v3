/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

export let canvas: HTMLCanvasElement = null;
export let gl: WebGLRenderingContext = null;
export let s_instance: LAppGlManager = null;

const WEBGL_UNSUPPORTED_MESSAGE =
  'This browser does not support the <code>&lt;canvas&gt;</code> element.';

/**
 * Cubism SDKのサンプルで使用するWebGLを管理するクラス
 */
export class LAppGlManager {
  /**
   * クラスのインスタンス（シングルトン）を返す。
   * インスタンスが生成されていない場合は内部でインスタンスを生成する。
   *
   * @return クラスのインスタンス
   */
  public static getInstance(): LAppGlManager {
    if (s_instance == null) {
      s_instance = new LAppGlManager();
    }

    return s_instance;
  }

  /**
   * クラスのインスタンス（シングルトン）を解放する。
   */
  public static releaseInstance(): void {
    if (s_instance != null) {
      s_instance.release();
    }

    s_instance = null;
  }

  constructor() {
    canvas = document.getElementById('live2d') as HTMLCanvasElement | null;

    if (!canvas) {
      throw new Error('Canvas element "#live2d" was not found.');
    }

    gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');

    if (!gl) {
      alert('Cannot initialize WebGL. This browser does not support.');
      document.body.innerHTML = WEBGL_UNSUPPORTED_MESSAGE;
    }
  }

  /**
   * 解放する。
   */
  public release(): void {}
}
