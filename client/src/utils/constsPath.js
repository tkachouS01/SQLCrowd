export const HOME_ROUTE = () => `/`;
export const SIGN_IN_ROUTE = () => `/sing-in`;
export const SIGN_UP_ROUTE = () => `/sign-up`;

export const RATING_ROUTE = () => `/rating`;
export const REQUESTS_ROLE_ROUTE = () => `/role-requests`;

export const USERS_ROUTE = () => `/users`;
export const USER_ONE_ROUTE = (userId) => `/users/${userId}`;

export const THEMES_ROUTE = () => `/themes`;
export const THEME_ONE_ROUTE = (themeId) => `/themes/${themeId}`;

export const THEME_TEST_ROUTE = (themeId) => `/themes/${themeId}/test`;

export const TASKS_ROUTE = (themeId) => `/themes/${themeId}/tasks`;
export const TASK_ONE_ROUTE = (themeId, taskId) => `/themes/${themeId}/tasks/${taskId}`;

export const SOLUTIONS_ROUTE = (themeId, taskId) => `/themes/${themeId}/tasks/${taskId}/solutions`;



