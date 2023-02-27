import React, { useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import throttle from "lodash.throttle";
import { ACTIONS, useTypedDispatch, useTypedSelector } from "@/store";
import { getObjectTypeIcon } from "./get-object-type-icon";
import { formatAz, formatDate, formatDec, formatDistance, formatGalaxyMorpho, formatRA } from "./formatter";
import { useTranslation } from "react-i18next";

export const ObjectInfo: React.FC = () => {
  const { cemStellarium, selectObject } = useTypedSelector(state => state.common);
  const dispatch = useTypedDispatch();
  const { t } = useTranslation();

  const updateSelectObject = useCallback(() => {
    const selected = cemStellarium?.getSelectedSkyObject();
    if (selected) {
      dispatch(ACTIONS.common.setSelectObject(selected));
    } else {
      dispatch(ACTIONS.common.unselectObject(undefined));
    }
  }, [cemStellarium]);

  useEffect(() => {
    const updateThrottles = throttle(updateSelectObject, 1000);
    cemStellarium?.eventManager.on('changeSelectObject', updateSelectObject);
    cemStellarium?.eventManager.on('changeCurrentDateTime', updateThrottles);
    cemStellarium?.eventManager.on('changeEarthLocation', updateThrottles);
    return () => {
      cemStellarium?.eventManager.off('changeSelectObject', updateSelectObject);
      cemStellarium?.eventManager.off('changeCurrentDateTime', updateThrottles);
      cemStellarium?.eventManager.off('changeEarthLocation', updateThrottles);
    }
  }, [cemStellarium]);

  const name = useTypedSelector(({ common: { cemStellarium, selectObject } }) => {
    if (!cemStellarium || !selectObject) return '';
    const tName = cemStellarium.engine.designationCleanup(selectObject.name);
    if (!Number.isNaN(Number(tName))) return tName;
    return t(tName, { ns: 'sky' });
  });

  const otherNames = useTypedSelector(({ common: { cemStellarium, selectObject } }) => {
    if (!cemStellarium || !selectObject) return '';
    const sliced = selectObject.names.slice(1, 8);
    return sliced.map((name) => {
      const tName = cemStellarium.engine.designationCleanup(name);
      if (!Number.isNaN(Number(tName))) return tName;
      return t(tName, { ns: 'sky' });
    }).join(', ');
  });

  const type = useTypedSelector(({ common: { cemStellarium, selectObject } }) => {
    if (!cemStellarium || !selectObject) return '';
    const formattedMorpho = formatGalaxyMorpho(selectObject.morpho);
    const formattedType = cemStellarium.engine.otypeToStr(selectObject.types[0]);
    if (formattedMorpho) {
      return t(formattedMorpho, { ns: 'otype' });
    }
    return t(formattedType, { ns: 'otype' });
  });

  const typeIconSrc = useTypedSelector(({ common: { cemStellarium, selectObject } }) => {
    if (!cemStellarium || !selectObject) return '';
    return getObjectTypeIcon(selectObject.types);
  });

  const phase = useTypedSelector(({ common: { cemStellarium, selectObject } }) => {
    if (!cemStellarium || !selectObject) return '';
    if (!selectObject.phase) return '';
    return (selectObject.phase * 100).toFixed(0) + '%';
  });

  const size = useTypedSelector(({ common: { cemStellarium, selectObject } }) => {
    if (!cemStellarium || !selectObject) return '';
    if (!selectObject.size) return '';
    const [sizeX, sizeY] = selectObject.size;
    return `${sizeX.toFixed(2)}' X ${sizeY.toFixed(2)}'`;
  });

  const radius = useTypedSelector(({ common: { cemStellarium, selectObject } }) => {
    if (!cemStellarium || !selectObject) return '';
    if (!selectObject.radius) return '';
    return Intl.NumberFormat().format(selectObject.radius).toString() + 'Km';
  });

  const magnitude = useTypedSelector(({ common: { cemStellarium, selectObject } }) => {
    if (!cemStellarium || !selectObject) return '';
    if (!selectObject.magnitude) return ''
    return selectObject.magnitude.toFixed(2);
  });

  const distance = useTypedSelector(({ common: { cemStellarium, selectObject } }) => {
    if (!cemStellarium || !selectObject) return '';
    if (!selectObject.distance) return '';
    const { unit, value } = formatDistance(selectObject.distance);
    return `${value.toFixed(2)} ${unit}`;
  });

  const visibleTime = useMemo(() => {
    return throttle(() => {
      if (!cemStellarium || !selectObject?.name) return '';
      const obj = cemStellarium.engine.getObj(selectObject.name);
      if (!obj) return '';
      const visibility = obj.computeVisibility();
      if (visibility.length === 0) {
        return t('관측 불가능');
      } else if (visibility[0].rise === null) {
        return t('항상 관측 가능');
      } else {
        const [riseTime, setTime] = [visibility[0].rise, visibility[0].set];
        return `${t('일출')}: ${formatDate(riseTime)}, ${t('일몰')}: ${formatDate(setTime)}`;
      }
    }, 200);
  }, [t, selectObject?.name]);

  const celestial = useTypedSelector(({ common: { cemStellarium, selectObject } }) => {
    if (!cemStellarium || !selectObject) return { ra: [], dec: [] };
    return {
      ra: formatRA(cemStellarium, selectObject.celestialCoordinates.ra),
      dec: formatDec(cemStellarium, selectObject.celestialCoordinates.dec),
    }
  });

  const horizontal = useTypedSelector(({ common: { cemStellarium, selectObject } }) => {
    if (!cemStellarium || !selectObject) return { az: [], alt: [] };
    return {
      az: formatAz(cemStellarium, selectObject.horizontalCoordinates.az),
      alt: formatDec(cemStellarium, selectObject.horizontalCoordinates.alt),
    }
  });

  if (!cemStellarium || !selectObject) {
    return null;
  }

  return (
    <ModalWrapper>
      <MajorInfo>
        <TypeIcon src={typeIconSrc} />
        <ObjectNameWrap>
          <div className="name">{name}</div>
          <div className="type">{type}</div>
        </ObjectNameWrap>
      </MajorInfo>

      {otherNames && (
        <PropertyList>
          <Key>{t('다른 이름')}</Key>
          <Value>{otherNames}</Value>
        </PropertyList>
      )}

      {magnitude && (
        <PropertyList>
          <Key>{t('등급')}</Key>
          <Value>{magnitude}</Value>
        </PropertyList>
      )}

      {distance && (
        <PropertyList>
          <Key>{t('거리')}</Key>
          <Value>{distance}</Value>
        </PropertyList>
      )}

      {radius && (
        <PropertyList>
          <Key>{t('반지름')}</Key>
          <Value>{radius}</Value>
        </PropertyList>
      )}

      {phase && (
        <PropertyList>
          <Key>{t('위상')}</Key>
          <Value>{phase}</Value>
        </PropertyList>
      )}

      {size && (
        <PropertyList>
          <Key>{t('크기')}</Key>
          <Value>{size}</Value>
        </PropertyList>
      )}

      <PropertyList>
        <Key>{t('적도좌표계')}<br />(Ra/Dec)</Key>
        <Value>
          {celestial.ra.map(({ value, unit }, i) => (
            <span key={i}>{value} <b>{unit}</b></span>
          ))}
          <br />
          {celestial.dec.map(({ value, unit }, i) => (
            <span key={i}>{value} <b>{unit}</b></span>
          ))}
        </Value>
      </PropertyList>

      <PropertyList>
        <Key>{t('지평좌표계')}<br />(Az/Alt)</Key>
        <Value>
          {horizontal.az.map(({ value, unit }, i) => (
            <span key={i}>{value} <b>{unit}</b></span>
          ))}
          <br />
          {horizontal.alt.map(({ value, unit }, i) => (
            <span key={i}>{value} <b>{unit}</b></span>
          ))}
        </Value>
      </PropertyList>

      {visibleTime && (
        <PropertyList>
          <Key>{t('관측가능시간')}</Key>
          <Value>{visibleTime()}</Value>
        </PropertyList>
      )}

    </ModalWrapper>
  )
}

const ModalWrapper = styled.ul`
  position: absolute;
  background-color: #2e2e2ead;
  width: 100%;
  max-width: 350px;
  height: auto;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px;
  margin: 0;
  color: white;
  border-radius: 8px;
  user-select: none;
  opacity: 0.8;
  pointer-events: none;
`;

const MajorInfo = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const TypeIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 12px;
`;

const ObjectNameWrap = styled.div`
  display: flex;
  flex-direction: column;

  .name {
    font-size: 18px;
    font-weight: 600;
  }
  .type {
    font-size: 13px;
    color: #a3a3a3;
  }
`;

const PropertyList = styled.li`
  display: flex;
  font-size: 12px;
  margin-top: 10px;
`;

const Key = styled.div`
  width: 100px;
`;

const Value = styled.div`
  flex: 1;

  span {
    padding-right: 8px;
  }
`;
