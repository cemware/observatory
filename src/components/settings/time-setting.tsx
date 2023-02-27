import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { EarthLocation, Language } from '@/cem-stellarium';
import { ACTIONS, useTypedDispatch, useTypedSelector } from '@/store';
import { numberToSupText } from '@/helper/number-to-sup-text';
import { getLocationName } from '@/helper/get-location-name';
import * as SettingStyles from './setting-styles';
import { InputNumber } from '../common/input-number';
import { InputDatetime } from '../common/input-date-time';
import { InputRadio } from '../common/input-radio';
import { useTranslation } from 'react-i18next';
import { LeafletMap } from '../common/leaflet-map';

const timeSpeedMap = [
  -(2 ** 16),
  -(2 ** 12),
  -(2 ** 8),
  -(2 ** 4),
  -(2 ** 0),
  0,
  +(2 ** 0),
  +(2 ** 4),
  +(2 ** 8),
  +(2 ** 12),
  +(2 ** 16),
];

export const TimeSetting: React.FC = () => {
  const { cemStellarium } = useTypedSelector((state) => state.common);
  const { isOpen, locationName, selectedTab } = useTypedSelector((state) => state.setting);
  const { dateTime, timeSpeed, longitude, latitude } = useTypedSelector((state) => state.setting.time);
  const latitudeInputRef = useRef<HTMLInputElement>(null);
  const longitudeInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useTypedDispatch();
  const { t, i18n } = useTranslation();

  const timeSpeedText = useMemo(() => {
    if (timeSpeed === 0) return t('정지');
    if (timeSpeed === 1) return t('배속1');
    const sign = timeSpeed < 0 ? '-' : '';
    const exp = Math.log2(Math.abs(timeSpeed));
    return `${timeSpeed}(${sign}2${numberToSupText(exp)}) ${t('배속')}`;
  }, [timeSpeed, t]);

  const updateTimezone = useCallback(async () => {
    if (!cemStellarium) return;
    const res = await getLocationName({ latitude, longitude, language: i18n.language as Language });
    if (res) {
      dispatch(ACTIONS.setting.setLocationName(res.data || ''));
    }
  }, [cemStellarium, latitude, longitude, dispatch, i18n.language]);

  useEffect(() => {
    if (isOpen && selectedTab === 'time') {
      updateTimezone();
    }
  }, [updateTimezone, isOpen, selectedTab]);

  const onChangeDateTime = useCallback((datetime: number) => {
    if (!cemStellarium) return;
    cemStellarium.currentDateTime = datetime;
  }, [cemStellarium])

  const onClickChangeTimeSpeedButton = useCallback((sign: -1 | 1) => () => {
    if (!cemStellarium) return;
    const currentIndex = timeSpeedMap.indexOf(timeSpeed);
    const nextValue = timeSpeedMap[currentIndex + sign];
    if (nextValue !== undefined) {
      cemStellarium.setTimeSpeed(nextValue);
    }
  }, [cemStellarium, timeSpeed]);

  const onChangeLatitude = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!cemStellarium) return;
    const value = Number(e.currentTarget.value);
    cemStellarium.setGeoLocation({ latitude: value });
  }, [cemStellarium]);

  const onChangeLongitude = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!cemStellarium) return;
    const value = Number(e.currentTarget.value);
    cemStellarium.setGeoLocation({ longitude: value });
  }, [cemStellarium]);

  const onChangeMapPosition = useCallback((latLng: { lat: number; lng: number; }) => {
    if (!cemStellarium) return;
    cemStellarium.setGeoLocation({ latitude: latLng.lat, longitude: latLng.lng });
    if (latitudeInputRef.current) {
      latitudeInputRef.current.value = latLng.lat.toFixed(7);
    }
    if (longitudeInputRef.current) {
      longitudeInputRef.current.value = latLng.lng.toFixed(7);
    }
  }, [cemStellarium]);

  const onChangeLanguage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const lang = e.currentTarget.value;
    i18n.changeLanguage(lang);
  }, [i18n]);

  useEffect(() => {
    const onChangeCurrentDateTime = (value: number) => dispatch(ACTIONS.setting.setTimeSetting({ key: 'dateTime', value }));
    const onChangeTimeSpeed = (value: number) => dispatch(ACTIONS.setting.setTimeSetting({ key: 'timeSpeed', value }));
    const onChangeEarthLocation = (earthLocation: EarthLocation) => {
      dispatch(ACTIONS.setting.setTimeSetting({ key: 'latitude', value: earthLocation.latitude }));
      dispatch(ACTIONS.setting.setTimeSetting({ key: 'longitude', value: earthLocation.longitude }));
    }
    cemStellarium?.eventManager.on('changeCurrentDateTime', onChangeCurrentDateTime);
    cemStellarium?.eventManager.on('changeTimeSpeed', onChangeTimeSpeed);
    cemStellarium?.eventManager.on('changeEarthLocation', onChangeEarthLocation);
    return () => {
      cemStellarium?.eventManager.off('changeCurrentDateTime', onChangeCurrentDateTime);
      cemStellarium?.eventManager.off('changeTimeSpeed', onChangeTimeSpeed);
      cemStellarium?.eventManager.off('changeEarthLocation', onChangeEarthLocation);
    }
  }, [cemStellarium]);

  if (!cemStellarium || !isOpen) return null;

  return (
    <SettingStyles.Wrapper>
      <SettingStyles.GroupTitle>{t('관측 시간')}</SettingStyles.GroupTitle>
      <SettingStyles.GroupContent>
        <SettingStyles.PropertyRow>
          <InputDatetime
            datetime={dateTime}
            onChange={onChangeDateTime}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('시간 배속')}</span>
          <span>{timeSpeedText}</span>
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <Button onClick={onClickChangeTimeSpeedButton(-1)}>{t('느리게')}</Button>
          <Button onClick={onClickChangeTimeSpeedButton(+1)}>{t('빠르게')}</Button>
        </SettingStyles.PropertyRow>
      </SettingStyles.GroupContent>

      <SettingStyles.GroupTitle>{t('관측 장소')}</SettingStyles.GroupTitle>
      <SettingStyles.GroupContent>
        <SettingStyles.PropertyRow>
          <InputLabel>{t('장소명')}</InputLabel>
          {locationName || t('알 수 없음')}
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <InputLabel>{t('위도')}</InputLabel>
          <InputNumber
            ref={latitudeInputRef}
            defaultValue={latitude.toFixed(7)}
            onChange={onChangeLatitude}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <InputLabel>{t('경도')}</InputLabel>
          <InputNumber
            ref={longitudeInputRef}
            defaultValue={longitude.toFixed(7)}
            onChange={onChangeLongitude}
          />
        </SettingStyles.PropertyRow>

        <MapWrapper>
          {selectedTab === 'time' && (
            <LeafletMap
              latitude={latitude}
              longitude={longitude}
              onChangePosition={onChangeMapPosition}
            />
          )}
        </MapWrapper>

        <SettingStyles.GroupTitle>{t('언어 변경')}</SettingStyles.GroupTitle>
        <SettingStyles.GroupContent>
          <SettingStyles.PropertyRow>
            <InputRadio
              name="lang"
              value="ko"
              checked={i18n.language === 'ko'}
              onChange={onChangeLanguage}
            >
              한국어
            </InputRadio>
            <InputRadio
              name="lang"
              value="en"
              checked={i18n.language === 'en'}
              onChange={onChangeLanguage}
            >
              English
            </InputRadio>
          </SettingStyles.PropertyRow>
        </SettingStyles.GroupContent>
      </SettingStyles.GroupContent>
    </SettingStyles.Wrapper>
  )
}


const Button = styled.button`
  flex: 1;
  border: none;
  padding: 4px 12px;
  font-size: 14px;
  margin: 0 4px;
  cursor: pointer;
  border-radius: 4px;
  background: #5063ed;
  color: white;
`;

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
`;

const InputLabel = styled.div`
  font-size: 14px;
  width: 70px;
`;
