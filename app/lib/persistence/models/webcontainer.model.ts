export interface WebContainerModel {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: 'creating' | 'active' | 'stopped' | 'error';
  createdAt: string;
  updatedAt: string;
  metadata?: {
    workdirName: string;
    ports?: number[];
    files?: string[];
    url?: string;
  };
  fileContents?: Record<string, string>; // contenu des fichiers du webcontainer
  userId: string;
}

export interface CreateWebContainerRequest {
  projectId: string;
  name: string;
  description?: string;
  metadata?: {
    workdirName: string;
    ports?: number[];
    files?: string[];
    url?: string;
  };
  fileContents?: Record<string, string>; // contenu des fichiers
}

export interface UpdateWebContainerRequest {
  status?: 'creating' | 'active' | 'stopped' | 'error';
  metadata?: {
    workdirName?: string;
    ports?: number[];
    files?: string[];
    url?: string;
  };
  fileContents?: Record<string, string>; // contenu des fichiers mis à jour
}
