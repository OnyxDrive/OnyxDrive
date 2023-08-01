import React from 'react';
import Logo from '../../core/branding/Logo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ButtonGroupNav from './ButtonGroupNav';
import StorageWidget from '../../storage-widget/storage-widget';

type Props = {};

export default function LeftNavbar({}: Props) {
  return (
    <div className='flex h-screen flex-col justify-between space-y-4 bg-blue-700 p-4'>
      <div>
        <Logo></Logo>
        <ButtonGroupNav></ButtonGroupNav>
      </div>
      <StorageWidget
        plan='Onyx Free Plan'
        used={2589934592}
        storage={8589934592}
      ></StorageWidget>
    </div>
  );
}
