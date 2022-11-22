import React from 'react';
import cx from 'classnames';

import styles from './FlexBox.module.scss';


type FlexDirection = 
    'row-reverse' |
    'column' |
    'column-reverse';

type FlexWrap =
    'wrap' |
    'wrap-reverse';

type FlexJustify =
    'end' |
    'center' |
    'space-between' |
    'space-around'

type FlexAlignItems =
    'start' |
    'end' |
    'center' |
    'baseline';

type FlexAlignContent =
    'start' |
    'end' |
    'center' |
    'baseline';

function classNameFromFlexType(
    direction?: FlexDirection,
    wrap?: FlexWrap,
    justify?: FlexJustify,
    alignItems?: FlexAlignItems,
    alignContent?: FlexAlignContent,
): ObjectOf<string, boolean> {
    const stringifyType = (classPrefix: string, propertyValue?: string) => propertyValue ? `${classPrefix}-${propertyValue}` : '';
    const classNameFromType = (classPrefix: string, propertyValue?: string) => styles[stringifyType(classPrefix, propertyValue)]

    return {
        [classNameFromType('direction', direction)]: true,
        [classNameFromType('', wrap)]: true,
        [classNameFromType('justify', justify)]: true,
        [classNameFromType('align-items', alignItems)]: true,
        [classNameFromType('align-content', alignContent)]: true,
    }
}

export interface IFlexBoxProps {
    children?: React.ReactNode,
    className?: string,
    direction?: FlexDirection,
    wrap?: FlexWrap,
    justify?: FlexJustify,
    alignItems?: FlexAlignItems,
    alignContent?: FlexAlignContent,
}

export const FlexBox = ({
    children,
    className,
    direction,
    wrap,
    justify,
    alignItems,
    alignContent,
}: IFlexBoxProps) => (
    <div className={cx(
        styles.flexBox,
        className,
        classNameFromFlexType(
            direction,
            wrap,
            justify,
            alignItems,
            alignContent,
        )
    )}>
        {children}
    </div>
);