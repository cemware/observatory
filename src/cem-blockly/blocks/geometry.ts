import { degreeToRadian, hourToDegree, radianToDegree } from '@/helper/math';
import { BaseBlock, BlockArgs } from '../core/block-args';
import { pseudoToNativeCoordinates } from '../core/utils';
import Interpreter from '../interpreter/lib/interpreter';
import { BlockCategory, BlockDefinition, EBlockHueColour, EBlockStrictType, EOperatorOrder, ExcuteCemStellariumFunc } from '../types';

export const GeometryCategory: BlockCategory = {
  type: 'contents',
  name: { ko: '도형', en: 'Geometry' },
  colour: EBlockHueColour.GEOMETRY,
  categoryIcon: ['/images/icon/blockly-geometry-on.svg', '/images/icon/blockly-geometry-off.svg'],
  contents: [

    {
      type: 'block-output',
      name: 'angle_coordinates',
      output: EBlockStrictType.COORDINATES,
      message0: {
        ko: '좌표 (%1, %2)',
        en: 'Coord (%1, %2)',
      },
      args0: [
        BlockArgs.Input.value({ name: 'coord1', strictType: [EBlockStrictType.ANGLE, EBlockStrictType.NUMBER] }),
        BlockArgs.Input.value({ name: 'coord2', strictType: [EBlockStrictType.ANGLE, EBlockStrictType.NUMBER] }),
      ],
      presetInputs: {
        coord1: { block: BaseBlock.angleDegree({ deg: 10 }) },
        coord2: { block: BaseBlock.angleDegree({ deg: 10 }) },
      },
      inputsInline: true,
      colour: EBlockHueColour.MATH,
      toJavascript() {
        const coord1 = BlockArgs.getInputArgsValue(this, 'coord1');
        const coord2 = BlockArgs.getInputArgsValue(this, 'coord2');
        return [`[${coord1}, ${coord2}]`, EOperatorOrder.FUNCTION_CALL];
      }
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'angle_degree',
      output: EBlockStrictType.ANGLE,
      message0: {
        ko: '각 %1˚ %2\' %3"',
        en: 'Angle %1˚ %2\' %3"',
      },
      args0: [
        BlockArgs.Field.number({ name: 'deg' }),
        BlockArgs.Field.number({ name: 'min' }),
        BlockArgs.Field.number({ name: 'sec' }),
      ],
      inputsInline: true,
      colour: EBlockHueColour.MEASURE,
      toJavascript() {
        const deg = BlockArgs.getFieldArgsValue(this, 'deg');
        const min = BlockArgs.getFieldArgsValue(this, 'min');
        const sec = BlockArgs.getFieldArgsValue(this, 'sec');
        const radian = degreeToRadian(deg + min / 60 + sec / 60 / 60);
        return [`${radian}`, EOperatorOrder.FUNCTION_CALL];
      }
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'angle_hour',
      output: EBlockStrictType.ANGLE,
      message0: {
        ko: '각 %1h %2m %3s',
        en: 'Angle %1h %2m %3s',
      },
      args0: [
        BlockArgs.Field.number({ name: 'hour' }),
        BlockArgs.Field.number({ name: 'min' }),
        BlockArgs.Field.number({ name: 'sec' }),
      ],
      inputsInline: true,
      colour: EBlockHueColour.MEASURE,
      toJavascript() {
        const hour = BlockArgs.getFieldArgsValue(this, 'hour');
        const min = BlockArgs.getFieldArgsValue(this, 'min');
        const sec = BlockArgs.getFieldArgsValue(this, 'sec');
        const degree = hourToDegree(hour) + hourToDegree(min / 60) + hourToDegree(sec / 60 / 60);
        const radian = degreeToRadian(degree);
        return [`${radian}`, EOperatorOrder.FUNCTION_CALL];
      }
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'angle_radian',
      output: EBlockStrictType.ANGLE,
      message0: {
        ko: '각 %1 rad',
        en: 'Angle %1 rad',
      },
      args0: [
        BlockArgs.Field.number({ name: 'radian' }),
      ],
      inputsInline: true,
      colour: EBlockHueColour.MEASURE,
      toJavascript() {
        const radian = BlockArgs.getFieldArgsValue(this, 'radian');
        return [`${radian}`, EOperatorOrder.FUNCTION_CALL];
      }
    } as BlockDefinition,

    {
      _DEPRECATED: true,
      type: 'block-built-in',
      name: 'colour_picker',
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'create_geometry_text',
      message0: {
        ko: '좌표(적경/적위) %1 텍스트 %2 %3 크기 %4 회전 %5 색 %6 불투명도 %7 ID %8 의 속성을 가진 텍스트 그리기 (적도좌표계)',
        en: 'Coordinates(Ra/Dec) %1 Text %2 %3 Size %4 Rotation %5 Color %6 Opacity %7 ID %8 Draw a text(Equatorial Coordinate System)',
      },
      tooltip: {
        ko: '주어진 좌표에 텍스트를 그립니다. 텍스트는 영문자, 숫자, 특수문자만 가능합니다.',
        en: 'Draw a text at the given coordinates. Text can only be alphabetic, numeric, or special characters.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'coord', strictType: EBlockStrictType.COORDINATES }),
        BlockArgs.Field.dropdownText({
          name: 'align',
          options: [
            { key: 'left', text: { ko: '왼쪽정렬', en: 'Align left' } },
            { key: 'center', text: { ko: '가운데정렬', en: 'Align center' } },
            { key: 'right', text: { ko: '오른쪽정렬', en: 'Align right' } },
          ]
        }),
        BlockArgs.Input.value({ name: 'text', strictType: EBlockStrictType.STRING }),
        BlockArgs.Input.value({ name: 'size', strictType: EBlockStrictType.NUMBER }),
        BlockArgs.Input.value({ name: 'rotate', strictType: EBlockStrictType.ANGLE }),
        BlockArgs.Input.value({ name: 'color', strictType: EBlockStrictType.COLOUR }),
        BlockArgs.Input.value({ name: 'opacity', strictType: EBlockStrictType.NUMBER }),
        BlockArgs.Input.value({ name: 'name', strictType: EBlockStrictType.STRING }),
      ],
      presetInputs: {
        coord: {
          block: BaseBlock.angleCoordinates(
            { hour: 3, min: 0, sec: 34.2 },
            { deg: 89, min: 21, sec: 59.1 },
          )
        },
        text: { block: BaseBlock.string("Polaris") },
        size: { block: BaseBlock.number(17) },
        rotate: { block: BaseBlock.angleRadian(0) },
        color: { block: BaseBlock.color('#ff0000') },
        opacity: { block: BaseBlock.number(1) },
        name: { block: BaseBlock.string('T1') },
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: false,
      excutes: [
        {
          name: 'createGeometryText',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              coord: [number, number], text: string, align: string, size: number, rotate: number, color: string, opacity: number, name: string,
            ) => excutor((cemStellarium) => {
              if (!coord) return;
              const [ra, dec] = pseudoToNativeCoordinates(coord);
              const { err, payload } = cemStellarium.geometry.addText({
                id: name,
                coordinates: [radianToDegree(ra), radianToDegree(dec)],
                text,
                size,
                rotate: radianToDegree(rotate),
                anchor: align as any,
                color,
                opacity,
              });
              if (err === 'invalid-text') {
                handleErrorInvalidText(payload);
              } else if (err === 'duplicate-id') {
                handleErrorDuplicateId(payload);
              }
            });
          },
        },
      ],
      toJavascript() {
        const coord = BlockArgs.getInputArgsValue(this, 'coord');
        const text = BlockArgs.getInputArgsValue(this, 'text');
        const align = BlockArgs.getFieldArgsValue(this, 'align');
        const size = BlockArgs.getInputArgsValue(this, 'size');
        const rotate = BlockArgs.getInputArgsValue(this, 'rotate');
        const color = BlockArgs.getInputArgsValue(this, 'color');
        const opacity = BlockArgs.getInputArgsValue(this, 'opacity');
        const name = BlockArgs.getInputArgsValue(this, 'name');
        return `createGeometryText(${coord}, ${text}, '${align}', ${size}, ${rotate}, ${color}, ${opacity}, ${name});\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'create_geometry_circle',
      message0: {
        ko: '좌표(적경/적위) %1 반지름 %2 색 %3 불투명도 %4 ID %5 의 속성을 가진 원 그리기 (적도좌표계)',
        en: 'Coordinates(Ra/Dec) %1 Radius %2 Color %3 Opacity %4 ID %5 Draw a circle(Equatorial Coordinate System)',
      },
      tooltip: {
        ko: '주어진 좌표에 원을 그립니다.',
        en: 'Draw a circle at the given coordinates.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'coord', strictType: EBlockStrictType.COORDINATES }),
        BlockArgs.Input.value({ name: 'radius', strictType: EBlockStrictType.NUMBER }),
        BlockArgs.Input.value({ name: 'color', strictType: EBlockStrictType.COLOUR }),
        BlockArgs.Input.value({ name: 'opacity', strictType: EBlockStrictType.NUMBER }),
        BlockArgs.Input.value({ name: 'name', strictType: EBlockStrictType.STRING }),
      ],
      presetInputs: {
        coord: {
          block: BaseBlock.angleCoordinates(
            { hour: 3, min: 0, sec: 34.2 },
            { deg: 89, min: 21, sec: 59.1 },
          )
        },
        radius: { block: BaseBlock.number(1) },
        color: { block: BaseBlock.color('#ff0000') },
        opacity: { block: BaseBlock.number(0.7) },
        name: { block: BaseBlock.string('C1') },
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: false,
      excutes: [
        {
          name: 'createGeometryCircle',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              coord: [number, number], radius: number, color: string, opacity: number, name: string,
            ) => excutor((cemStellarium) => {
              if (!coord) return;
              const [ra, dec] = pseudoToNativeCoordinates(coord);
              const { err, payload } = cemStellarium.geometry.addCircle({
                id: name,
                center: [radianToDegree(ra), radianToDegree(dec)],
                radius,
                fillColor: color,
                opacity
              });
              if (err === 'duplicate-id') {
                handleErrorDuplicateId(payload);
              }
            });
          },
        },
      ],
      toJavascript() {
        const coord = BlockArgs.getInputArgsValue(this, 'coord');
        const radius = BlockArgs.getInputArgsValue(this, 'radius');
        const color = BlockArgs.getInputArgsValue(this, 'color');
        const opacity = BlockArgs.getInputArgsValue(this, 'opacity');
        const name = BlockArgs.getInputArgsValue(this, 'name');
        return `createGeometryCircle(${coord}, ${radius}, ${color}, ${opacity}, ${name});\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'create_geometry_triangle',
      message0: {
        ko: '좌표(적경/적위) 1 %1 좌표(적경/적위) 2 %2 좌표(적경/적위) 3 %3 색 %4 불투명도 %5 ID %6 의 속성을 가진 삼각형 그리기 (적도좌표계)',
        en: 'Coordinates(Ra/Dec) 1 %1 Coordinates(Ra/Dec) 2 %2 Coordinates(Ra/Dec) 3 %3 Color %4 Opacity %5 ID %6 Draw a triangle(Equatorial Coordinate System)',
      },
      tooltip: {
        ko: '주어진 세 좌표를 꼭짓점으로 하는 삼각형을 그립니다.',
        en: 'Draw a triangle at the given coordinates.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'coord1', strictType: EBlockStrictType.COORDINATES }),
        BlockArgs.Input.value({ name: 'coord2', strictType: EBlockStrictType.COORDINATES }),
        BlockArgs.Input.value({ name: 'coord3', strictType: EBlockStrictType.COORDINATES }),
        BlockArgs.Input.value({ name: 'color', strictType: EBlockStrictType.COLOUR }),
        BlockArgs.Input.value({ name: 'opacity', strictType: EBlockStrictType.NUMBER }),
        BlockArgs.Input.value({ name: 'name', strictType: EBlockStrictType.STRING }),
      ],
      presetInputs: {
        coord1: { block: BaseBlock.angleCoordinates({ deg: 0 }, { deg: 0 }) },
        coord2: { block: BaseBlock.angleCoordinates({ deg: 10 }, { deg: 20 }) },
        coord3: { block: BaseBlock.angleCoordinates({ deg: -30 }, { deg: 40 }) },
        color: { block: BaseBlock.color('#33cc00') },
        opacity: { block: BaseBlock.number(0.7) },
        name: { block: BaseBlock.string('P1') },
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: false,
      excutes: [
        {
          name: 'createGeometryTriangle',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              coord1: [number, number], coord2: [number, number], coord3: [number, number], color: string, opacity: number, name: string,
            ) => excutor((cemStellarium) => {
              if (!coord1 || !coord2 || !coord3) return;
              const [x1, y1] = pseudoToNativeCoordinates(coord1);
              const [x2, y2] = pseudoToNativeCoordinates(coord2);
              const [x3, y3] = pseudoToNativeCoordinates(coord3);
              const coordinates = [
                [radianToDegree(x1), radianToDegree(y1)],
                [radianToDegree(x2), radianToDegree(y2)],
                [radianToDegree(x3), radianToDegree(y3)],
                [radianToDegree(x1), radianToDegree(y1)],
              ] as any;
              const { err, payload } = cemStellarium.geometry.addPolygon({
                id: name,
                coordinates,
                fillColor: color,
                opacity,
              });
              if (err === 'duplicate-id') {
                handleErrorDuplicateId(payload);
              }
            });
          },
        },
      ],
      toJavascript() {
        const coord1 = BlockArgs.getInputArgsValue(this, 'coord1');
        const coord2 = BlockArgs.getInputArgsValue(this, 'coord2');
        const coord3 = BlockArgs.getInputArgsValue(this, 'coord3');
        const color = BlockArgs.getInputArgsValue(this, 'color');
        const opacity = BlockArgs.getInputArgsValue(this, 'opacity');
        const name = BlockArgs.getInputArgsValue(this, 'name');
        return `createGeometryTriangle(${coord1}, ${coord2}, ${coord3}, ${color}, ${opacity}, ${name});\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'create_geometry_lines',
      message0: {
        ko: '좌표(적경/적위) 리스트 %1 색 %2 불투명도 %3 ID %4 의 속성을 가진 선 그리기 (적도좌표계)',
        en: 'Coordinates(Ra/Dec) %1 Color %2 Opacity %3 ID %4 Draw lines(Equatorial Coordinate System)',
      },
      tooltip: {
        ko: '주어진 좌표들을 잇는 선을 그립니다.',
        en: 'Draw lines at the given coordinates.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'coordinates', strictType: [EBlockStrictType.ARRAY] }),
        BlockArgs.Input.value({ name: 'color', strictType: EBlockStrictType.COLOUR }),
        BlockArgs.Input.value({ name: 'opacity', strictType: EBlockStrictType.NUMBER }),
        BlockArgs.Input.value({ name: 'name', strictType: EBlockStrictType.STRING }),
      ],
      presetInputs: {
        coordinates: {
          block: BaseBlock.listCoordinates([
            [{ hour: 3, min: 0, sec: 34.2 }, { deg: 89, min: 21, sec: 59.1 }],
            [{ hour: 17, min: 24, sec: 47.1 }, { deg: 86, min: 33, sec: 44.4 }],
            [{ hour: 16, min: 43, sec: 40.4 }, { deg: 81, min: 59, sec: 19.6 }],
            [{ hour: 15, min: 43, sec: 18.2 }, { deg: 77, min: 42, sec: 55.6 }],
            [{ hour: 14, min: 50, sec: 41.9 }, { deg: 74, min: 3, sec: 16.5 }],
            [{ hour: 15, min: 20, sec: 43.7 }, { deg: 71, min: 44, sec: 41.9 }],
            [{ hour: 16, min: 16, sec: 51.5 }, { deg: 75, min: 41, sec: 38.6 }],
            [{ hour: 15, min: 43, sec: 18.2 }, { deg: 77, min: 42, sec: 55.6 }],
          ])
        },
        color: { block: BaseBlock.color('#ff99ff') },
        opacity: { block: BaseBlock.number(1) },
        name: { block: BaseBlock.string('L1') },
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: false,
      excutes: [
        {
          name: 'createGeometryLines',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              coordinates: [number, number][], color: string, opacity: number, name: string,
            ) => excutor((cemStellarium) => {
              const parsed = Interpreter.prototype.arrayPseudoToNative(coordinates) as [number, number][];
              const result = parsed.filter(Boolean).map((coord) => {
                const [x, y] = pseudoToNativeCoordinates(coord);
                return [radianToDegree(x), radianToDegree(y)];
              }) as [number, number][];
              const { err, payload } = cemStellarium.geometry.addLines({
                id: name,
                coordinates: result,
                strokeColor: color,
                opacity,
              });
              if (err === 'duplicate-id') {
                handleErrorDuplicateId(payload);
              }
            });
          },
        },
      ],
      toJavascript() {
        const coordinates = BlockArgs.getInputArgsValue(this, 'coordinates');
        const color = BlockArgs.getInputArgsValue(this, 'color');
        const opacity = BlockArgs.getInputArgsValue(this, 'opacity');
        const name = BlockArgs.getInputArgsValue(this, 'name');
        return `createGeometryLines(${coordinates}, ${color}, ${opacity}, ${name});\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'delete_geometry_object_by_id',
      message0: {
        ko: 'ID %1 도형 삭제하기',
        en: 'Delete a shape with the id %1',
      },
      tooltip: {
        ko: '해당 ID를 가진 도형을 삭제합니다.',
        en: 'Delete a geometry object with id.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'name', strictType: EBlockStrictType.STRING }),
      ],
      presetInputs: {
        name: { block: BaseBlock.string('C1') },
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: true,
      excutes: [
        {
          name: 'deleteGeometryObjectById',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              name: string,
            ) => excutor((cemStellarium) => {
              cemStellarium.geometry.remove(name);
            });
          },
        },
      ],
      toJavascript() {
        const name = BlockArgs.getInputArgsValue(this, 'name');
        return `deleteGeometryObjectById(${name});\n`;
      }
    } as BlockDefinition,
  ],
}

function handleErrorDuplicateId(id?: string) {
  console.error(`[Blockcoding] Object id has duplicated: "${id}"`);
}


function handleErrorInvalidText(id?: string) {
  console.error(`[Blockcoding] You cannot use following character to text: "${id}"`);
}