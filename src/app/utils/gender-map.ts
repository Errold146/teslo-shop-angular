import { Gender } from '@products/interfaces/product.interface';

export const GenderMap: Record<Gender, string> = {
    [Gender.Men]: 'Hombres',
    [Gender.Women]: 'Mujeres',
    [Gender.Kid]: 'Niños',
    [Gender.Unisex]: 'Unisex'
};
