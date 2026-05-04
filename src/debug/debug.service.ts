import { Injectable } from '@nestjs/common';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class DebugService {
  private configs: any[] = [
    {
      configKey: 'featureX',
      configValue: 'off',
      isSensitive: false,
      description: 'Feature X 토글',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
    },
    {
      configKey: 'secretMode',
      configValue: 'on',
      isSensitive: true,
      description: '민감 정보 노출',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
    },
  ];

  getConfigs(): any[] {
    return this.configs;
  }

  updateConfig(key: string, dto: UpdateConfigDto): any {
    const idx = this.configs.findIndex((c) => c.configKey === key);
    const base = idx >= 0 ? this.configs[idx] : { configKey: key };
    const updated = {
      ...base,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    if (idx >= 0) this.configs[idx] = updated;
    else this.configs.push(updated);
    return updated;
  }

  getSecrets(): any[] {
    return this.configs.filter((c) => c.isSensitive);
  }

  queryTest(body: any): any {
    // raw SQL 테스트 시나리오를 에뮬레이션하기 위해
    // 여기서는 받은 payload를 그대로 되돌려 줍니다.
    return { echo: body };
  }
}