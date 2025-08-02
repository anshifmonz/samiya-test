import { supabaseAdmin } from '../supabase';

export interface AdminActivityLogParams {
  admin_id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view' | 'export' | 'import';
  entity_type: 'product' | 'category' | 'section' | 'collection' | 'admin_user' | 'auth' | 'stock' | 'tag';
  entity_id?: string;
  table_name?: string;
  message: string;
  metadata?: Record<string, any>;
  status?: 'success' | 'failed';
  error?: any;
  request_path?: string;
  ip_address?: string;
  user_agent?: string;
}

export async function logAdminActivity(params: AdminActivityLogParams): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('admin_activity_logs')
      .insert({
        admin_id: params.admin_id,
        action: params.action,
        entity_type: params.entity_type,
        entity_id: params.entity_id || null,
        table_name: params.table_name || null,
        message: params.message,
        metadata: params.metadata || null,
        status: params.status || 'success',
        error: params.error || null,
        request_path: params.request_path || null,
        ip_address: params.ip_address || null,
        user_agent: params.user_agent || null,
      });

    if (error) {
      console.error('Failed to log admin activity:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error logging admin activity:', error);
    return false;
  }
}

export function createProductMessage(action: string, productTitle: string, details?: string): string {
  const baseMessage = `${action.charAt(0).toUpperCase() + action.slice(1)} product "${productTitle}"`;
  return details ? `${baseMessage} - ${details}` : baseMessage;
}

export function createCategoryMessage(action: string, categoryName: string, details?: string): string {
  const baseMessage = `${action.charAt(0).toUpperCase() + action.slice(1)} category "${categoryName}"`;
  return details ? `${baseMessage} - ${details}` : baseMessage;
}

export function createCollectionMessage(action: string, collectionTitle: string, details?: string): string {
  const baseMessage = `${action.charAt(0).toUpperCase() + action.slice(1)} collection "${collectionTitle}"`;
  return details ? `${baseMessage} - ${details}` : baseMessage;
}

export function createSectionMessage(action: string, sectionTitle: string, details?: string): string {
  const baseMessage = `${action.charAt(0).toUpperCase() + action.slice(1)} section "${sectionTitle}"`;
  return details ? `${baseMessage} - ${details}` : baseMessage;
}

export function createAdminUserMessage(action: string, username: string, details?: string): string {
  const baseMessage = `${action.charAt(0).toUpperCase() + action.slice(1)} admin user "${username}"`;
  return details ? `${baseMessage} - ${details}` : baseMessage;
}
