import React, { useEffect } from 'react';
import { ACTIONS, useTypedDispatch, useTypedSelector } from '@/store';
import { Switch } from '../common/switch';
import * as SettingStyles from './setting-styles';
import { useTranslation } from 'react-i18next';

export const ViewSetting: React.FC = () => {
  const { cemStellarium } = useTypedSelector((state) => state.common);
  const visible = useTypedSelector(state => state.setting.visible);
  const { t } = useTranslation()
  const dispatch = useTypedDispatch();

  useEffect(() => {
    const onChangeVisibleAtmosphere = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'atmosphere', visible }));
    const onChangeVisibleLandscapes = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'landscapes', visible }));
    const onChangeVisibleMilkyway = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'milkyway', visible }));
    const onChangeVisibleDSS = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'dss', visible }));
    const onChangeVisibleStars = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'stars', visible }));
    const onChangeVisibleDSO = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'dsos', visible }));
    const onChangeVisiblePlanets = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'planets', visible }));
    const onChangeVisibleMinorPlanets = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'minorPlanets', visible }));
    const onChangeVisibleComets = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'comets', visible }));
    const onChangeVisibleSatellites = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'satellites', visible }));
    const onChangeVisibleEclipticLine = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'eclipticLine', visible }));
    const onChangeVisibleMeridianLine = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'meridianLine', visible }));
    const onChangeVisibleEquatorialLine = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'equatorialLine', visible }));
    const onChangeVisibleAzimuthalLine = (visible: boolean) => dispatch(ACTIONS.setting.setVisibleSetting({ key: 'azimuthalLine', visible }));

    cemStellarium?.eventManager.on('changeVisibleAtmosphere', onChangeVisibleAtmosphere);
    cemStellarium?.eventManager.on('changeVisibleLandscapes', onChangeVisibleLandscapes);
    cemStellarium?.eventManager.on('changeVisibleMilkyway', onChangeVisibleMilkyway);
    cemStellarium?.eventManager.on('changeVisibleDSS', onChangeVisibleDSS);
    cemStellarium?.eventManager.on('changeVisibleStars', onChangeVisibleStars);
    cemStellarium?.eventManager.on('changeVisibleDSO', onChangeVisibleDSO);
    cemStellarium?.eventManager.on('changeVisiblePlanets', onChangeVisiblePlanets);
    cemStellarium?.eventManager.on('changeVisibleMinorPlanets', onChangeVisibleMinorPlanets);
    cemStellarium?.eventManager.on('changeVisibleComets', onChangeVisibleComets);
    cemStellarium?.eventManager.on('changeVisibleSatellites', onChangeVisibleSatellites);
    cemStellarium?.eventManager.on('changeVisibleEclipticLine', onChangeVisibleEclipticLine);
    cemStellarium?.eventManager.on('changeVisibleMeridianLine', onChangeVisibleMeridianLine);
    cemStellarium?.eventManager.on('changeVisibleEquatorialLine', onChangeVisibleEquatorialLine);
    cemStellarium?.eventManager.on('changeVisibleAzimuthalLine', onChangeVisibleAzimuthalLine);
    return () => {
      cemStellarium?.eventManager.off('changeVisibleAtmosphere', onChangeVisibleAtmosphere);
      cemStellarium?.eventManager.off('changeVisibleLandscapes', onChangeVisibleLandscapes);
      cemStellarium?.eventManager.off('changeVisibleMilkyway', onChangeVisibleMilkyway);
      cemStellarium?.eventManager.off('changeVisibleDSS', onChangeVisibleDSS);
      cemStellarium?.eventManager.off('changeVisibleStars', onChangeVisibleStars);
      cemStellarium?.eventManager.off('changeVisibleDSO', onChangeVisibleDSO);
      cemStellarium?.eventManager.off('changeVisiblePlanets', onChangeVisiblePlanets);
      cemStellarium?.eventManager.off('changeVisibleMinorPlanets', onChangeVisibleMinorPlanets);
      cemStellarium?.eventManager.off('changeVisibleComets', onChangeVisibleComets);
      cemStellarium?.eventManager.off('changeVisibleSatellites', onChangeVisibleSatellites);
      cemStellarium?.eventManager.off('changeVisibleEclipticLine', onChangeVisibleEclipticLine);
      cemStellarium?.eventManager.off('changeVisibleMeridianLine', onChangeVisibleMeridianLine);
      cemStellarium?.eventManager.off('changeVisibleEquatorialLine', onChangeVisibleEquatorialLine);
      cemStellarium?.eventManager.off('changeVisibleAzimuthalLine', onChangeVisibleAzimuthalLine);
    }
  }, [cemStellarium]);

  if (!cemStellarium) return null;

  return (
    <SettingStyles.Wrapper>
      <SettingStyles.GroupTitle>{t('배경 보기 설정')}</SettingStyles.GroupTitle>
      <SettingStyles.GroupContent>
        <SettingStyles.PropertyRow>
          <span>{t('대기')}</span>
          <Switch
            value={visible.atmosphere}
            onToggle={v => cemStellarium?.setVisibleAtmosphere(v)}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('풍경')}</span>
          <Switch
            value={visible.landscapes}
            onToggle={v => cemStellarium?.setVisibleLandscapes(v)}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('은하수')}</span>
          <Switch
            value={visible.milkyway}
            onToggle={v => cemStellarium?.setVisibleMilkyway(v)}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('디지털 배경(DSS)')}</span>
          <Switch
            value={visible.dss}
            onToggle={v => cemStellarium?.setVisibleDSS(v)}
          />
        </SettingStyles.PropertyRow>
      </SettingStyles.GroupContent>

      <SettingStyles.GroupTitle>{t('천체 보기 설정')}</SettingStyles.GroupTitle>
      <SettingStyles.GroupContent>
        <SettingStyles.PropertyRow>
          <span>{t('별')}</span>
          <Switch
            value={visible.stars}
            onToggle={v => cemStellarium?.setVisibleStars(v)}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('별 집단(DSO)')}</span>
          <Switch
            value={visible.dsos}
            onToggle={v => cemStellarium?.setVisibleDSOs(v)}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('태양계 행성')}</span>
          <Switch
            value={visible.planets}
            onToggle={v => cemStellarium?.setVisiblePlanets(v)}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('외계 행성')}</span>
          <Switch
            value={visible.minorPlanets}
            onToggle={v => cemStellarium?.setVisibleMinorPlanets(v)}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('혜성')}</span>
          <Switch
            value={visible.comets}
            onToggle={v => cemStellarium?.setVisibleComets(v)}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('인공위성')}</span>
          <Switch
            value={visible.satellites}
            onToggle={v => cemStellarium?.setVisibleSatellites(v)}
          />
        </SettingStyles.PropertyRow>
      </SettingStyles.GroupContent>

      <SettingStyles.GroupTitle>{t('보조선 보기 설정')}</SettingStyles.GroupTitle>
      <SettingStyles.GroupContent>
        <SettingStyles.PropertyRow>
          <span>{t('황도')}</span>
          <Switch
            value={visible.eclipticLine}
            onToggle={v => cemStellarium?.setVisibleEclipticLine(v)}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('자오선')}</span>
          <Switch
            value={visible.meridianLine}
            onToggle={v => cemStellarium?.setVisibleMeridianLine(v)}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('적도좌표계')}</span>
          <Switch
            value={visible.equatorialLine}
            onToggle={v => cemStellarium?.setVisibleEquatorialLine(v)}
          />
        </SettingStyles.PropertyRow>
        <SettingStyles.PropertyRow>
          <span>{t('지평좌표계')}</span>
          <Switch
            value={visible.azimuthalLine}
            onToggle={v => cemStellarium?.setVisibleAzimuthalLine(v)}
          />
        </SettingStyles.PropertyRow>
      </SettingStyles.GroupContent>
    </SettingStyles.Wrapper>
  )
}
