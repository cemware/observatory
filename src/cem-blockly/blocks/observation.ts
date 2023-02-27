import { degreeToRadian } from '@/helper/math';
import { BaseBlock, BlockArgs } from '../core/block-args';
import { pseudoToNativeCoordinates } from '../core/utils';
import Interpreter from '../interpreter/lib/interpreter';
import { BlockCategory, BlockDefinition, EBlockHueColour, EBlockStrictType, EOperatorOrder, ExcuteCemStellariumFunc } from '../types';

export const ObservationCategory: BlockCategory = {
  type: 'contents',
  name: { ko: '관측', en: 'Observation' },
  colour: EBlockHueColour.OBSERVER,
  categoryIcon: ['/images/icon/blockly-observation.png', '/images/icon/blockly-observation.png'],
  contents: [

    {
      type: 'block-statement',
      name: 'set_visible_background',
      message0: {
        ko: '배경 %1를(을) %2',
        en: '%2 background %1',
      },
      tooltip: {
        ko: '해당 배경을 보이거나 숨길 수 있습니다.',
        en: 'Show or hide background.',
      },
      args0: [
        BlockArgs.Field.dropdownText({
          name: 'type',
          options: [
            { key: 'atmosphere', text: { ko: '대기', en: 'atmosphere' } },
            { key: 'landscapes', text: { ko: '풍경', en: 'landscapes' } },
            { key: 'milkyway', text: { ko: '은하수', en: 'milkyway' } },
            { key: 'dss', text: { ko: '디지털 배경(DSS)', en: 'DSS(Digitized Sky Survey)' } },
          ],
        }),
        BlockArgs.Field.dropdownText({
          name: 'action',
          options: [
            { key: 'hide', text: { ko: '숨기기', en: 'Hide' } },
            { key: 'show', text: { ko: '보이기', en: 'Show' } },
          ],
        }),
      ],
      presetFields: {
        type: 'atmosphere',
        action: 'hide',
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: true,
      excutes: [
        {
          name: 'setVisibleBackground',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              type: string, action: string,
            ) => excutor((cemStellarium) => {
              const visible = action === 'show';
              if (type === 'atmosphere') cemStellarium.setVisibleAtmosphere(visible);
              if (type === 'landscapes') cemStellarium.setVisibleLandscapes(visible);
              if (type === 'milkyway') cemStellarium.setVisibleMilkyway(visible);
              if (type === 'dss') cemStellarium.setVisibleDSS(visible);
            });
          },
        },
      ],
      toJavascript() {
        const type = BlockArgs.getFieldArgsValue(this, 'type');
        const action = BlockArgs.getFieldArgsValue(this, 'action');
        return `setVisibleBackground('${type}', '${action}');\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'set_visible_sky_object',
      message0: {
        ko: '천체 %1를(을) %2',
        en: '%2 %1',
      },
      tooltip: {
        ko: '해당 천체 그룹을 보이거나 숨길 수 있습니다.',
        en: 'Show or hide the celestial group.',
      },
      args0: [
        BlockArgs.Field.dropdownText({
          name: 'type',
          options: [
            { key: 'stars', text: { ko: '별', en: 'stars' } },
            { key: 'dsos', text: { ko: '별 집단(DSO)', en: 'DSO(Deep Sky Objects)' } },
            { key: 'planets', text: { ko: '태양계 행성', en: 'SSO(Solar System Objects)' } },
            { key: 'minorPlanets', text: { ko: '외계 행성', en: 'minor planets' } },
            { key: 'comets', text: { ko: '혜성', en: 'comets' } },
            { key: 'satellites', text: { ko: '인공위성', en: 'satellites' } },
          ],
        }),
        BlockArgs.Field.dropdownText({
          name: 'action',
          options: [
            { key: 'hide', text: { ko: '숨기기', en: 'Hide' } },
            { key: 'show', text: { ko: '보이기', en: 'Show' } },
          ],
        }),
      ],
      presetFields: {
        type: 'stars',
        action: 'hide',
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: true,
      excutes: [
        {
          name: 'setVisibleSkyObject',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              type: string, action: string,
            ) => excutor((cemStellarium) => {
              const visible = action === 'show';
              if (type === 'stars') cemStellarium.setVisibleStars(visible);
              if (type === 'dsos') cemStellarium.setVisibleDSOs(visible);
              if (type === 'planets') cemStellarium.setVisiblePlanets(visible);
              if (type === 'minorPlanets') cemStellarium.setVisibleMinorPlanets(visible);
              if (type === 'comets') cemStellarium.setVisibleComets(visible);
              if (type === 'satellites') cemStellarium.setVisibleSatellites(visible);
            });
          },
        },
      ],
      toJavascript() {
        const type = BlockArgs.getFieldArgsValue(this, 'type');
        const action = BlockArgs.getFieldArgsValue(this, 'action');
        return `setVisibleSkyObject('${type}', '${action}');\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'set_visible_line',
      message0: {
        ko: '보조선 %1를(을) %2',
        en: '%2 %1',
      },
      tooltip: {
        ko: '해당 보조선을 보이거나 숨길 수 있습니다.',
        en: 'Show or hide the line(s).',
      },
      args0: [
        BlockArgs.Field.dropdownText({
          name: 'type',
          options: [
            { key: 'ecliptic', text: { ko: '황도', en: 'ecliptic line' } },
            { key: 'meridian', text: { ko: '자오선', en: 'meridian line' } },
            { key: 'equatorial', text: { ko: '적도좌표계', en: 'equatorial lines' } },
            { key: 'azimuthal', text: { ko: '지평좌표계', en: 'azimuthal lines' } },
          ],
        }),
        BlockArgs.Field.dropdownText({
          name: 'action',
          options: [
            { key: 'hide', text: { ko: '숨기기', en: 'Hide' } },
            { key: 'show', text: { ko: '보이기', en: 'Show' } },
          ],
        }),
      ],
      presetFields: {
        type: 'ecliptic',
        action: 'hide',
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: true,
      excutes: [
        {
          name: 'setVisibleLine',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              type: string, action: string,
            ) => excutor((cemStellarium) => {
              const visible = action === 'show';
              if (type === 'ecliptic') cemStellarium.setVisibleEclipticLine(visible);
              if (type === 'meridian') cemStellarium.setVisibleMeridianLine(visible);
              if (type === 'equatorial') cemStellarium.setVisibleEquatorialLine(visible);
              if (type === 'azimuthal') cemStellarium.setVisibleAzimuthalLine(visible);
            });
          },
        },
      ],
      toJavascript() {
        const type = BlockArgs.getFieldArgsValue(this, 'type');
        const action = BlockArgs.getFieldArgsValue(this, 'action');
        return `setVisibleLine('${type}', '${action}');\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'set_select_object',
      message0: {
        ko: '%1 이름의 천체 선택하기',
        en: 'Select sky object %1',
      },
      tooltip: {
        ko: '해당 이름의 천체를 선택합니다.',
        en: 'Select an object with name.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'name', strictType: EBlockStrictType.STRING }),
      ],
      presetInputs: {
        name: { block: BaseBlock.string('Sun') },
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: true,
      excutes: [
        {
          name: 'setSelectObject',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              name: string,
            ) => excutor((cemStellarium) => {
              const obj = cemStellarium.getStelObjectByName(name);
              cemStellarium.engine.core.selection = obj ?? 0;
            });
          },
        },
      ],
      toJavascript() {
        const name = BlockArgs.getInputArgsValue(this, 'name');
        return `setSelectObject(${name});\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'unselect_object',
      message0: {
        ko: '천체 선택 해제하기',
        en: 'Unselect sky object',
      },
      tooltip: {
        ko: '선택되어있는 천체가 있으면 선택해제합니다.',
        en: 'Unselect object.',
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: true,
      excutes: [
        {
          name: 'unselectObject',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return () => excutor((cemStellarium) => {
              cemStellarium.engine.core.selection = 0;
            });
          },
        },
      ],
      toJavascript() {
        return `unselectObject();\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'get_object_number_property',
      output: EBlockStrictType.NUMBER,
      message0: {
        ko: '%1 이름의 천체 %2 속성 가져오기',
        en: 'Get %2 property of object %1',
      },
      tooltip: {
        ko: '해당 천체의 숫자형 속성을 반환할 수 있습니다. 속성이 없으면 0이 반환됩니다.',
        en: 'You can return the numeric properties of that celestial body. If no property exists, 0 is returned.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'name', strictType: EBlockStrictType.STRING }),
        BlockArgs.Field.dropdownText({
          name: 'key',
          options: [
            { key: 'magnitude', text: { ko: '등급', en: 'magnitude' } },
            { key: 'radius', text: { ko: '반지름(km)', en: 'radius(km)' } },
            { key: 'phase', text: { ko: '위상(%)', en: 'phase(%)' } },
          ],
        }),
      ],
      presetInputs: {
        name: { block: BaseBlock.string('Sun') },
      },
      colour: EBlockHueColour.MATH,
      inputsInline: true,
      excutes: [
        {
          name: 'getObjectNumberProperty',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              name: string, key: string,
            ) => excutor((cemStellarium) => {
              const obj = cemStellarium.getSkyObjectByName(name);
              if (key === 'magnitude') return obj?.magnitude ?? 0;
              if (key === 'radius') return obj?.radius ?? 0;
              if (key === 'phase') return obj?.phase ?? 0;
              return 0;
            });
          },
        },
      ],
      toJavascript() {
        const name = BlockArgs.getInputArgsValue(this, 'name');
        const key = BlockArgs.getFieldArgsValue(this, 'key');
        return [`getObjectNumberProperty(${name}, '${key}')`, EOperatorOrder.FUNCTION_CALL];
      }
    } as BlockDefinition,

    {
      type: 'block-output',
      name: 'get_object_coordinate_property',
      output: EBlockStrictType.COORDINATES,
      message0: {
        ko: '%1 이름의 천체 %2 좌표 가져오기',
        en: 'Get %2 property of object %1',
      },
      tooltip: {
        ko: '해당 천체의 선택된 좌표계에 따른 좌표 정보를 반환할 수 있습니다. 속성이 없으면 [0, 0]이 반환됩니다.',
        en: 'You can return the string properties of that celestial body. If no property exists, "" is returned.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'name', strictType: EBlockStrictType.STRING }),
        BlockArgs.Field.dropdownText({
          name: 'key',
          options: [
            { key: 'radec', text: { ko: '적도좌표계', en: 'Equatorial coordinates' } },
            { key: 'azalt', text: { ko: '지평좌표계', en: 'Azimuthal coordinates' } },
          ],
        }),
      ],
      presetInputs: {
        name: { block: BaseBlock.string('Sun') },
      },
      colour: EBlockHueColour.MATH,
      inputsInline: true,
      excutes: [
        {
          name: 'getObjectCoordinateProperty',
          excuteCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              name: string, key: string,
            ) => excutor((cemStellarium) => {
              const obj = cemStellarium.getSkyObjectByName(name);
              let coordinates = [0, 0];
              if (obj) {
                if (key === 'radec') coordinates = [obj.celestialCoordinates.ra, obj.celestialCoordinates.dec];
                if (key === 'azalt') coordinates = [obj.horizontalCoordinates.az, obj.horizontalCoordinates.alt];
              }
              return coordinates;
            });
          },
        },
      ],
      toJavascript() {
        const name = BlockArgs.getInputArgsValue(this, 'name');
        const key = BlockArgs.getFieldArgsValue(this, 'key');
        return [`getObjectCoordinateProperty(${name}, '${key}')`, EOperatorOrder.FUNCTION_CALL];
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'set_view_to_object',
      message0: {
        ko: '%1 천체 위치로 화면을 %2초 동안 맞추기',
        en: 'Move camera viewpoint to the position of object %1 for %2 seconds',
      },
      tooltip: {
        ko: '해당 이름의 천체로 화면을 주어진 시간만큼 애니매이션으로 이동합니다.',
        en: 'It moves the camera viewpoint to the animation for the time.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'name', strictType: EBlockStrictType.STRING }),
        BlockArgs.Input.value({ name: 'duration', strictType: EBlockStrictType.NUMBER }),
      ],
      presetInputs: {
        name: { block: BaseBlock.string("moon") },
        duration: { block: BaseBlock.number(1) },
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: true,
      excutes: [
        {
          name: 'setViewToObject',
          excuteAsyncCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              name: string, duration: number, callback: Function,
            ) => excutor((cemStellarium) => {
              const obj = cemStellarium.getStelObjectByName(name);
              if (obj) {
                duration = Math.max(0, duration);
                cemStellarium.engine.pointAndLock(obj, duration);
                setTimeout(() => {
                  callback();
                }, duration * 1000);
              } else {
                callback();
              }
            });
          },
        },
      ],
      toJavascript() {
        const name = BlockArgs.getInputArgsValue(this, 'name');
        const duration = BlockArgs.getInputArgsValue(this, 'duration');
        return `setViewToObject(${name}, ${duration});\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'set_view_by_radec',
      message0: {
        ko: '좌표(적경/적위) %1 애니매이션 시간 %2 화면 위치를 해당 적도좌표계로 이동하기',
        en: 'Coordinate(Ra/Dec) %1 Animation Time %2 Move the screen position to the equatorial coordinate',
      },
      tooltip: {
        ko: '화면을 적도좌표계의 해당 좌표값으로 해당 시간동안 이동합니다.',
        en: 'Move the screen to the corresponding coordinate value of the equatorial coordinate system for given seconds.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'coord', strictType: EBlockStrictType.COORDINATES }),
        BlockArgs.Input.value({ name: 'duration', strictType: EBlockStrictType.NUMBER }),
      ],
      presetInputs: {
        coord: {
          block: BaseBlock.angleCoordinates(
            { hour: 3, min: 0, sec: 34.2 },
            { deg: 89, min: 21, sec: 59.1 },
          )
        },
        duration: { block: BaseBlock.number(1) },
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: false,
      excutes: [
        {
          name: 'setViewByRaDec',
          excuteAsyncCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              coord: [number, number], duration: number, callback: Function,
            ) => excutor((cemStellarium) => {
              if (!coord) return;
              duration = Math.max(0, duration);
              const [ra, dec] = pseudoToNativeCoordinates(coord);
              cemStellarium.setCameraViewByRaDec(ra, dec, duration);
              setTimeout(() => {
                callback();
              }, duration * 1000);
            });
          },
        },
      ],
      toJavascript() {
        const coord = BlockArgs.getInputArgsValue(this, 'coord');
        const duration = BlockArgs.getInputArgsValue(this, 'duration');
        return `setViewByRaDec(${coord}, ${duration});\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'set_view_by_azalt',
      message0: {
        ko: '좌표(방위각/고도) %1 애니매이션 시간 %2 화면 위치를 해당 지평좌표계로 이동하기',
        en: 'Coordinate(Az/Alt) %1 Animation Time %2 Move the screen position to the horizontal coordinate',
      },
      tooltip: {
        ko: '화면을 지평좌표계의 해당 좌표값으로 해당 시간동안 이동합니다.',
        en: 'Move the screen to the corresponding coordinate value of the horizontal coordinate system for given seconds.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'coord', strictType: EBlockStrictType.COORDINATES }),
        BlockArgs.Input.value({ name: 'duration', strictType: EBlockStrictType.NUMBER }),
      ],
      presetInputs: {
        coord: {
          block: BaseBlock.angleCoordinates(
            { deg: 60, min: 0, sec: 0 },
            { deg: 30, min: 0, sec: 0 },
          )
        },
        duration: { block: BaseBlock.number(1) },
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: false,
      excutes: [
        {
          name: 'setViewByAzAlt',
          excuteAsyncCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              coord: [number, number], duration: number, callback: Function,
            ) => excutor((cemStellarium) => {
              if (!coord) return;
              const [az, alt] = pseudoToNativeCoordinates(coord);
              duration = Math.max(0, duration);
              cemStellarium.setCameraViewByAzAlt(az, alt, duration);
              setTimeout(() => {
                callback();
              }, duration * 1000);
            });
          },
        },
      ],
      toJavascript() {
        const coord = BlockArgs.getInputArgsValue(this, 'coord');
        const duration = BlockArgs.getInputArgsValue(this, 'duration');
        return `setViewByAzAlt(${coord}, ${duration});\n`;
      }
    } as BlockDefinition,

    {
      type: 'block-statement',
      name: 'set_zoom',
      message0: {
        ko: '%2초동안 화각 %1도 만큼 화면 확대/축소',
        en: 'Zoom screen by %1 degrees angle of view for %2 seconds',
      },
      tooltip: {
        ko: '주어진 시간동안 화면을 확대/축소합니다. 0.001 ~ 180사이의 화각 값을 입력합니다.',
        en: 'Zoom the screen for a given time. Enter a viewing angle value between 0.001 and 180.',
      },
      args0: [
        BlockArgs.Input.value({ name: 'value', strictType: EBlockStrictType.NUMBER }),
        BlockArgs.Input.value({ name: 'duration', strictType: EBlockStrictType.NUMBER }),
      ],
      presetInputs: {
        value: { block: BaseBlock.number(18) },
        duration: { block: BaseBlock.number(1.5) },
      },
      nextStatement: null,
      previousStatement: null,
      inputsInline: true,
      excutes: [
        {
          name: 'setZoom',
          excuteAsyncCemStellarium(excutor: ExcuteCemStellariumFunc<void>) {
            return (
              value: number, duration: number, callback: Function,
            ) => excutor((cemStellarium) => {
              duration = Math.max(0, duration);
              cemStellarium.engine.zoomTo(degreeToRadian(value), duration);
              setTimeout(() => {
                callback();
              }, duration * 1000);
            });
          },
        },
      ],
      toJavascript() {
        const value = BlockArgs.getInputArgsValue(this, 'value');
        const duration = BlockArgs.getInputArgsValue(this, 'duration');
        return `setZoom(${value}, ${duration});\n`;
      }
    } as BlockDefinition,

  ],
}