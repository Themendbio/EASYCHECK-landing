'use client';

// Inline lucide-react equivalents — small, semantic SVGs.
// stroke="currentColor", width/height via props for size.

const Icon = ({ children, size = 18, className = '', strokeWidth = 2, ...rest }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        {...rest}
    >
        {children}
    </svg>
);

// lucide Play (filled triangle, but as outlined stroke -- match lucide default)
const IconPlay = (props) => (
    <Icon {...props}>
        <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none" />
    </Icon>
);

// lucide CheckCircle2
const IconCheck = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </Icon>
);

// lucide Menu
const IconMenu = (props) => (
    <Icon {...props}>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
    </Icon>
);

// lucide X
const IconX = (props) => (
    <Icon {...props}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </Icon>
);

// lucide HardHat
const IconHardHat = (props) => (
    <Icon {...props}>
        <path d="M2 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2H2v2Z" />
        <path d="M4 16a8 8 0 0 1 16 0" />
        <path d="M10 8V5a2 2 0 0 1 4 0v3" />
    </Icon>
);

// lucide Heart
const IconHeart = (props) => (
    <Icon {...props}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
    </Icon>
);

// lucide Sun
const IconSun = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </Icon>
);

// lucide Users (어르신 케어)
const IconUsers = (props) => (
    <Icon {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
);

// lucide ChevronRight
const IconChevronRight = (props) => (
    <Icon {...props}>
        <polyline points="9 6 15 12 9 18" />
    </Icon>
);

// lucide BellRing
const IconBellRing = (props) => (
    <Icon {...props}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        <path d="M4 2C2.8 3.7 2 5.7 2 8" />
        <path d="M22 8c0-2.3-.8-4.3-2-6" />
    </Icon>
);

// lucide Info
const IconInfo = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </Icon>
);

// lucide Target
const IconTarget = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </Icon>
);

// lucide Building2
const IconBuilding2 = (props) => (
    <Icon {...props}>
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
        <path d="M10 14h4" />
        <path d="M10 18h4" />
    </Icon>
);

export {
    Icon,
    IconPlay,
    IconCheck,
    IconMenu,
    IconX,
    IconHardHat,
    IconHeart,
    IconSun,
    IconUsers,
    IconChevronRight,
    IconBellRing,
    IconTarget,
    IconBuilding2,
    IconInfo,
};
