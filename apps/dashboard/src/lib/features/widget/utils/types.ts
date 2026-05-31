import { pathworks, type InferResponseType } from '$lib/utils/services/api';
import type {
  TCreateWidget,
  TUpdateWidget,
  TWidgetConfig,
  TWidgetDetail,
  TWidgetPayload
} from '@cio/utils/validation/widget';

export type GetWidgetsRequest = (typeof pathworks.organization)['widgets']['$get'];
export type GetWidgetDetailRequest = (typeof pathworks.organization)['widgets'][':widgetId']['$get'];
export type CreateWidgetRequest = (typeof pathworks.organization)['widgets']['$post'];
export type UpdateWidgetRequest = (typeof pathworks.organization)['widgets'][':widgetId']['$put'];
export type PublishWidgetRequest = (typeof pathworks.organization)['widgets'][':widgetId']['publish']['$post'];
export type RollbackWidgetRequest = (typeof pathworks.organization)['widgets'][':widgetId']['rollback']['$post'];
export type DeleteWidgetRequest = (typeof pathworks.organization)['widgets'][':widgetId']['$delete'];

export type GetWidgetsSuccess = Extract<InferResponseType<GetWidgetsRequest>, { success: true }>;
export type WidgetListItem = GetWidgetsSuccess['data'][number];

export type GetWidgetDetailSuccess = Extract<InferResponseType<GetWidgetDetailRequest>, { success: true }>;
export type WidgetDetailResponse = GetWidgetDetailSuccess['data'];
export type WidgetDetail = TWidgetDetail & WidgetDetailResponse;

export type PublishWidgetSuccess = Extract<InferResponseType<PublishWidgetRequest>, { success: true }>;
export type RollbackWidgetSuccess = Extract<InferResponseType<RollbackWidgetRequest>, { success: true }>;

export type WidgetConfig = TWidgetConfig;
export type WidgetPayload = TWidgetPayload;
export type CreateWidgetInput = TCreateWidget;
export type UpdateWidgetInput = TUpdateWidget;
