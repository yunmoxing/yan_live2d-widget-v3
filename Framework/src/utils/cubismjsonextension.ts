/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {
  JsonArray,
  JsonBoolean,
  JsonFloat,
  JsonMap,
  JsonNullvalue,
  JsonString,
  Value
} from './cubismjson';

/**
 * CubismJsonで実装されているJsonパーサを使用せず、
 * TypeScript標準のJsonパーサなどを使用し出力された結果を
 * Cubism SDKで定義されているJSONエレメントの要素に
 * 置き換える処理をするクラス。
 */
export class CubismJsonExtension {
  static parseJsonObject(obj: Record<string, unknown>, map: JsonMap) {
    Object.keys(obj).forEach(key => {
      map.put(key, CubismJsonExtension.toCubismValue(obj[key]));
    });
    return map;
  }

  protected static parseJsonArray(obj: unknown[]) {
    const arr = new JsonArray();
    obj.forEach(item => {
      arr.add(this.toCubismValue(item));
    });
    return arr;
  }

  protected static toCubismValue(value: unknown): Value {
    if (typeof value == 'boolean') {
      return new JsonBoolean(value);
    }

    if (typeof value == 'string') {
      return new JsonString(value);
    }

    if (typeof value == 'number') {
      return new JsonFloat(value);
    }

    if (value instanceof Array) {
      return this.parseJsonArray(value);
    }

    if (value && typeof value == 'object') {
      return this.parseJsonObject(
        value as Record<string, unknown>,
        new JsonMap()
      );
    }

    return new JsonNullvalue();
  }
}
