import { itemRepositoryContract } from '../../testing/item-repository-contract';
import { createMemoryItemRepository } from './item-repository';

itemRepositoryContract('memory adapter', () => createMemoryItemRepository());
