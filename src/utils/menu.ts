import type {CSSProperties} from 'vue'

export type MenuProp = Array<{
    title: string
    subTitle?: string[]
}>

export type MenuStyles = {
    container: CSSProperties
    containerActive: CSSProperties
    menuItem: CSSProperties
    trigger: CSSProperties
    triggerActive: CSSProperties
    icon: CSSProperties
    title: CSSProperties
    submenu: CSSProperties
    submenuItem: CSSProperties
    submenuItemActive: CSSProperties
}

export const menuStyles: MenuStyles = {
    container: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        minHeight: '40px',
        padding: '2px 8px',
        borderRadius: '0',
        background: 'rgba(255, 255, 255, 0.52)',
        boxShadow: 'inset 0 0.5px 0 rgba(255, 255, 255, 0.5), 0 0.5px 0 rgba(0, 0, 0, 0.03)',
        color: '#1d1d1f',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        isolation: 'isolate',
    },
    containerActive: {
        background: 'rgba(255, 255, 255, 0.62)',
        boxShadow: 'inset 0 0.5px 0 rgba(255, 255, 255, 0.55), 0 0.5px 0 rgba(0, 0, 0, 0.04)',
    },
    menuItem: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
    },
    trigger: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        minHeight: '34px',
        padding: '3px 14px',
        border: '0',
        borderRadius: '17px',
        background: 'transparent',
        color: 'inherit',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
        fontSize: '16px',
        fontWeight: '500',
        lineHeight: '25px',
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        transition: 'background-color 0.08s ease, color 0.08s ease',
    },
    triggerActive: {
        background: 'rgba(0, 0, 0, 0.10)',
        boxShadow: 'inset 0 0.5px 0 rgba(255, 255, 255, 0.25)',
    },
    icon: {
        display: 'block',
        flex: '0 0 auto',
        width: '24px',
        height: '24px',
        color: 'currentColor',
    },
    title: {
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 'min(42vw, 280px)',
    },
    submenu: {
        position: 'absolute',
        zIndex: 10,
        top: 'calc(100% + 8px)',
        left: '0',
        minWidth: '270px',
        padding: '8px',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '18px',
        background: 'rgba(255, 255, 255, 0.92)',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
    },
    submenuItem: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minHeight: '32px',
        padding: '5px 13px',
        border: '0',
        borderRadius: '16px',
        background: 'transparent',
        color: '#1d1d1f',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '23px',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        transition: 'background-color 0.08s ease, color 0.08s ease',
    },
    submenuItemActive: {
        background: 'rgba(0, 0, 0, 0.11)',
        color: '#000000',
    },
}
