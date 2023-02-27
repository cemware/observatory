import { ProgressBar } from "@/cem-stellarium/lib";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components";
import planets from '@/cem-stellarium/data/planets'

interface ProgressCircleProps {
  data: ProgressBar;
}
export const ProgressMessage: React.FC<ProgressCircleProps> = ({
  data,
}) => {
  const { t } = useTranslation();

  const formattedLabel = useMemo(() => {
    if (data.label === 'Stars') {
      return t('별 정보 로드 중');
    } else if (data.label === 'Landscape') {
      return t('풍경 이미지 로드 중');
    } else if (data.label === 'DSS colored') {
      return t('디지털 배경(DSS) 이미지 로드 중');
    } else if (data.label === 'DSO') {
      return t('천체 정보 로드 중');
    } else if (data.label === 'milkyway') {
      return t('은하수 이미지 로드 중');
    } else if (Object.keys(planets).includes(data.label.toLowerCase())) {
      return t('행성 이미지 로드 중');
    }
    return '';
  }, [data]);

  const rate = useMemo(() => {
    const per = (data.value / data.total) * 100;
    return per.toFixed(0);
  }, [data]);

  return (
    <Wrapper data-finish={data.value / data.total === 1}>
      <Label>{`${formattedLabel} (${rate}%)`}</Label>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  padding: 3px 9px;
  opacity: 1;
  transition: opacity .4s;
  &[data-finish="true"] {
    opacity: 0;
  }

  animation: ${keyframes`
    from {opacity: 0} to {opacity: 1}
  `} 1s;
`;

const Label = styled.div`
  color: white;
  font-size: 11px;
  text-shadow: black -1px 0px, black 0px 1px, black 1px 0px, black 0px -1px;
`;
