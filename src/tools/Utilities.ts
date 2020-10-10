import { Config } from '@/lib/types';
import moment from 'moment';

export class Utilities {

  private config: (Config | null) = null;

  /**
   * Fetch configuration file from filesystem (created on deployment)
   * and cache it in the class as `config`
   */
  public async fetchConfig(): Promise<Config> {
    if (this.config) return this.config;

    const config: Config = await fetch(`${window.location.origin}/config.json`).then((res) => res.json());

    this.config = config;

    return this.config;
  }

  /**
   * Convert a string to title-case.
   * @param input String to convert
   */
  public titleCase(input: string): string {
    if (!input) return '';
    const pieces = [...input.toLowerCase().split(/[\s_-]/)];
    for (let i = 0; i < pieces.length; i++) {
      pieces[i] = pieces[i].charAt(0).toUpperCase() + pieces[i].slice(1);
    }
    return pieces.join(' ');
  }

  /**
   * Format a phone number using regular expressions
   * @param phone
   */
  public formatPhone(phone: string): string {
    if (!phone) return '';
    const regExp = /^(\d{3})(?:-|\s)?(\d{3})(?:-|\s)?(\d{4})(?:\s)?(E?XT?\s?\d{1,})?$/;
    const m = phone.match(regExp);
    if (m) {
      let base = `(${m[1]}) ${m[2]}-${m[3]}`;
      if (m[4]) base += ` [EXT. ${m[4].replace(/\D/g, '')}]`;
      return base;
    }
    return phone;
  }

  /**
   * Format a date string
   * @param date
   * @param withTime Format the date with time. Optional.
   */
  public formatDate(date: string, withTime = false) {
    const d = moment(date);
    if (withTime) return d.format('YYYY-MM-DD @ hh:mma');
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * Copy properties of one object to matching properties
   * of another object. Returns `true` if copy was sucessful
   * and `false` if not.
   * @param a Copy from
   * @param b Copy to
   */
  copyProperties(a: Record<string, any>, b: Record<string, any>): boolean {
    if (!a || !b) false;
    Object.keys(a).forEach((key) => {
      if (typeof b[key] === 'undefined') return;
      b[key] = a[key];
    });
    return true;
  }

  /**
   * Checks if the current browser is IE
   */
  isUsingIEBrowser() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');

    if (msie > -1 || !!navigator.userAgent.match(/Trident.*rv:11\./)) {
      return true;
    }
    return false;
  }

  /**
   * Create a timestring from millismseconds
   * @param ms
   */
  msToTime(milliseconds: number) {
    /**
     * Pad a number with specified number of places
     * @param n Number to pad
     * @param precision How many places to pad to. Defaults to 2.
     */
    function pad(n: number, precision = 2) {
      return ('00' + n).slice(-precision);
    }

    const ms = milliseconds % 1000;
    milliseconds = (milliseconds - ms) / 1000;
    const secs = milliseconds % 60;
    milliseconds = (milliseconds - secs) / 60;
    const mins = milliseconds % 60;
    const hrs = (milliseconds - mins) / 60;

    if (hrs) {
      return hrs + '.' + pad(mins) + '.' + pad(secs);
    }

    return mins + '.' + pad(secs);
  }
}

export default new Utilities();
